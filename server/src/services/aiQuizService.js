import { openai, isOpenAIConfigured, OPENAI_MODEL } from '../config/openai.js';
import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { computeQuestionHash } from '../utils/hashUtil.js';

export async function generateQuizQuestions({
  topic = 'General Programming',
  subtopic = 'Fundamentals',
  difficulty = 'medium',
  learningObjective = 'Understand core principles',
  count = 5,
  moduleId = null,
  userId = null
}) {
  // If OpenAI is available, try generating dynamic fresh questions with up to 3 retries
  if (isOpenAIConfigured) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const prompt = `You are an expert technical curriculum designer and senior engineer.
Generate ${count} high-quality, practical multiple-choice quiz questions for:
- Topic: "${topic}"
- Subtopic: "${subtopic}"
- Difficulty: "${difficulty}" (easy, medium, hard, or advanced)
- Learning Objective: "${learningObjective}"

CRITICAL FORMATTING INSTRUCTIONS:
Return a strictly valid JSON object ONLY. No markdown wrappers, no backticks, no preamble.
The JSON must follow this exact schema:
{
  "questions": [
    {
      "question": "Clear, direct technical question",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": 0,
      "explanation": "Clear explanation of why this option is correct and why other options are incorrect",
      "difficulty": "${difficulty}",
      "topic": "${topic}",
      "subtopic": "${subtopic}"
    }
  ]
}

Strict Validation Rules:
1. "options" must have exactly 4 strings.
2. All 4 options must be distinct and non-empty.
3. "correctAnswer" must be an integer index between 0 and 3.
4. "explanation" must provide educational value.`;

        const response = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an AI assessment engine that outputs strictly valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        const rawContent = response.choices[0]?.message?.content?.trim();
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            const validatedQuestions = [];

            for (const q of parsed.questions) {
              // Validate schema requirements
              if (
                typeof q.question === 'string' &&
                q.question.trim().length > 10 &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                new Set(q.options).size === 4 &&
                typeof q.correctAnswer === 'number' &&
                q.correctAnswer >= 0 &&
                q.correctAnswer <= 3 &&
                typeof q.explanation === 'string'
              ) {
                const hash = computeQuestionHash(q.question);
                validatedQuestions.push({
                  id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  module_id: moduleId,
                  question: q.question.trim(),
                  options: q.options,
                  correct_answer: q.correctAnswer,
                  explanation: q.explanation,
                  difficulty: q.difficulty || difficulty,
                  topic: q.topic || topic,
                  subtopic: q.subtopic || subtopic,
                  source: 'ai_generated',
                  learning_objective: learningObjective,
                  question_hash: hash
                });
              }
            }

            if (validatedQuestions.length >= Math.min(count, 3)) {
              return validatedQuestions.slice(0, count);
            }
          }
        }
      } catch (err) {
        console.warn(`[AI Quiz Generation] Attempt ${attempt} failed:`, err.message);
      }
    }
  }

  // Fallback to Question Bank (Supabase or Local Seed Bank)
  return getFallbackQuestions({ moduleId, topic, difficulty, count });
}

export async function getFallbackQuestions({ moduleId, topic, difficulty, count = 5 }) {
  // If Supabase is available, query the questions table
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('questions').select('*');

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      } else if (topic) {
        query = query.ilike('topic', `%${topic}%`);
      }

      const { data, error } = await query.limit(count * 3);
      if (!error && data && data.length > 0) {
        // Randomize and return
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      }
    } catch (err) {
      console.warn('[Question Bank] Supabase query failed, falling back to local dataset:', err.message);
    }
  }

  // Local Seed Data Fallback
  const curriculum = getLocalCurriculum();
  let matched = [];

  if (moduleId) {
    matched = curriculum.questions.filter(q => q.module_id === moduleId);
  }

  if (matched.length === 0 && topic) {
    matched = curriculum.questions.filter(
      q => q.topic.toLowerCase().includes(topic.toLowerCase())
    );
  }

  if (matched.length === 0) {
    matched = curriculum.questions;
  }

  const shuffled = [...matched].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
