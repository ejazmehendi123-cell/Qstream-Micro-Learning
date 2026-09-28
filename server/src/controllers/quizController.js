import crypto from 'crypto';
import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { generateQuizQuestions } from '../services/aiQuizService.js';
import { updateUserTopicPerformance } from '../services/adaptiveService.js';
import { scheduleTopicRevision } from '../services/spacedRepetitionService.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';
import { cache } from '../config/redis.js';

// Active in-memory store for ongoing quiz sessions (to safely keep correct answers hidden until submit)
// Cache is used for quiz sessions to survive nodemon/server restarts

export async function generateQuiz(req, res) {
  const { moduleId, difficulty: requestedDiff, count = 5 } = req.body;

  const validation = validateIdentifier(moduleId, 'Module ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const curriculum = getLocalCurriculum();
  let moduleItem = curriculum.modules.find(m => m.id === moduleId || m.slug === moduleId);

  if (!moduleItem && isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('modules').select('*').eq('id', moduleId).maybeSingle();
      if (data) moduleItem = data;
    } catch (err) {
      console.warn('[Find Module Error]', err.message);
    }
  }

  if (!moduleItem && String(moduleId).startsWith('rev-')) {
    // Generate a mock module for revision based on ID
    moduleItem = {
      id: moduleId,
      title: 'Spaced Repetition Review',
      topic: 'Mixed Revision',
      subtopic: 'Review Core Concepts',
      difficulty: 'medium',
      learning_objectives: ['Review past topics to strengthen retention']
    };
  }

  if (!moduleItem) {
    return sendError(res, `Module '${moduleId}' not found. Cannot start quiz.`, 404);
  }

  const userId = req.user?.id || 'anonymous-user';
  const difficulty = requestedDiff || moduleItem.difficulty || 'medium';

  try {
    // Generate questions (OpenAI or fallback question bank)
    const rawQuestions = await generateQuizQuestions({
      topic: moduleItem.topic,
      subtopic: moduleItem.subtopic,
      difficulty,
      learningObjective: moduleItem.learning_objectives?.[0] || 'Master core concepts',
      count: Math.max(3, Math.min(10, count)),
      moduleId: moduleItem.id,
      userId
    });

    const quizId = `quiz-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Store complete questions with correct answers in cache session
    await cache.set(quizId, {
      quizId,
      moduleId: moduleItem.id,
      userId,
      moduleTitle: moduleItem.title,
      topic: moduleItem.topic,
      subtopic: moduleItem.subtopic,
      difficulty,
      createdAt: Date.now(),
      questions: rawQuestions
    }, 3600); // 1 hour TTL

    // Strip out correct_answer and explanation before sending to frontend!
    const sanitizedQuestions = rawQuestions.map((q, index) => ({
      id: q.id || `q-${index + 1}`,
      questionIndex: index + 1,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      topic: q.topic,
      subtopic: q.subtopic,
      learning_objective: q.learning_objective
    }));

    return sendSuccess(res, {
      quizId,
      moduleId: moduleItem.id,
      moduleTitle: moduleItem.title,
      topic: moduleItem.topic,
      subtopic: moduleItem.subtopic,
      difficulty,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    }, 'Quiz initialized successfully');
  } catch (err) {
    return sendError(res, 'Failed to generate quiz questions', 500, err);
  }
}

export async function getQuizById(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Quiz ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const session = await cache.get(id);
  if (!session) {
    return sendError(res, `Quiz session '${id}' has expired or does not exist. Please start a new quiz.`, 404);
  }

  // Strip correct answers
  const sanitizedQuestions = session.questions.map((q, index) => ({
    id: q.id || `q-${index + 1}`,
    questionIndex: index + 1,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    topic: q.topic,
    subtopic: q.subtopic
  }));

  return sendSuccess(res, {
    quizId: session.quizId,
    moduleId: session.moduleId,
    moduleTitle: session.moduleTitle,
    topic: session.topic,
    subtopic: session.subtopic,
    difficulty: session.difficulty,
    totalQuestions: sanitizedQuestions.length,
    questions: sanitizedQuestions
  });
}

export async function submitQuiz(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Quiz ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  const { answers = [], timeSpent = 60 } = req.body;
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

  const session = await cache.get(id);
  if (!session) {
    return sendError(res, `Quiz session '${id}' has expired or is invalid.`, 400);
  }

  const originalQuestions = session.questions;
  let correctCount = 0;
  let wrongCount = 0;

  const evaluatedAnswers = originalQuestions.map((q, index) => {
    // Match answer by question id or index
    const userAnswer = answers.find(a => a.questionId === q.id) || answers[index];
    const selectedAnswer = userAnswer ? Number(userAnswer.selectedAnswer) : null;
    const isCorrect = selectedAnswer === q.correct_answer;

    if (isCorrect) correctCount++;
    else wrongCount++;

    return {
      questionId: q.id,
      question: q.question,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correct_answer,
      isCorrect,
      explanation: q.explanation,
      topic: q.topic,
      subtopic: q.subtopic,
      timeSpent: userAnswer ? Number(userAnswer.timeSpent) || 10 : 10
    };
  });

  const totalQuestions = originalQuestions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const score = accuracy; // score out of 100

  // 1. Identify weak subtopics from wrong answers
  const weakTopics = [];
  evaluatedAnswers.forEach(ans => {
    if (!ans.isCorrect && ans.subtopic && !weakTopics.includes(ans.subtopic)) {
      weakTopics.push(ans.subtopic);
    }
  });

  // 2. Update user topic performance and spaced repetition
  for (const ans of evaluatedAnswers) {
    await updateUserTopicPerformance({
      userId,
      topic: ans.topic,
      subtopic: ans.subtopic,
      isCorrect: ans.isCorrect,
      timeSpent: ans.timeSpent
    });
  }

  // Schedule spaced repetition for this topic
  await scheduleTopicRevision({
    userId,
    topic: session.topic,
    subtopic: session.subtopic,
    accuracy
  });

  // 3. Persist attempt in Supabase if configured
  const attemptId = `att-${Date.now()}`;
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: attemptRecord } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          module_id: session.moduleId,
          score,
          total_questions: totalQuestions,
          correct_answers: correctCount,
          wrong_answers: wrongCount,
          accuracy,
          time_spent: Number(timeSpent) || 60,
          difficulty: session.difficulty
        })
        .select('id')
        .single();

      if (attemptRecord) {
        // Save answers
        const answerRows = evaluatedAnswers.map(a => ({
          attempt_id: attemptRecord.id,
          question_id: a.questionId.startsWith('ai-') ? null : a.questionId,
          selected_answer: a.selectedAnswer,
          is_correct: a.isCorrect,
          time_spent: a.timeSpent
        }));
        await supabase.from('quiz_attempt_answers').insert(answerRows);

        // Update module progress to completed if accuracy >= 60%
        if (accuracy >= 60) {
          await supabase.from('user_progress').upsert({
            user_id: userId,
            module_id: session.moduleId,
            status: 'completed',
            completion_percentage: 100,
            time_spent: Number(timeSpent) || 60,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,module_id' });
        }

        // Increment user XP in profiles
        const earnedXP = correctCount * 20;
        await supabase.rpc('update_user_xp', { user_id: userId, xp_delta: earnedXP }).catch(() => {});
      }
    } catch (err) {
      console.warn('[Submit Quiz Supabase Error]', err.message);
    }
  }

  // Clean up cache session
  await cache.del(id);

  return sendSuccess(res, {
    attemptId,
    quizId: id,
    moduleId: session.moduleId,
    moduleTitle: session.moduleTitle,
    score,
    totalQuestions,
    correctCount,
    wrongCount,
    accuracy,
    timeSpent: Number(timeSpent) || 60,
    weakTopics,
    passed: accuracy >= 60,
    evaluatedAnswers,
    aiRecommendations: weakTopics.length > 0
      ? `Focus your revision on: ${weakTopics.join(', ')}. A revision session has been automatically scheduled.`
      : 'Outstanding performance! You have demonstrated comprehensive mastery of this topic.'
  }, 'Quiz submitted and evaluated successfully');
}
