import { askAiTutor } from '../services/aiTutorService.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';

export async function handleTutorChat(req, res) {
  const { message, conversationHistory = [], moduleContext, topicContext } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return sendError(res, 'Message content cannot be empty', 400);
  }

  const userProfile = {
    learning_goal: req.user?.learning_goal || 'Full Stack Web Development',
    preferred_difficulty: req.user?.preferred_difficulty || 'medium',
    weakTopics: []
  };

  try {
    const tutorResponse = await askAiTutor({
      message: message.trim(),
      conversationHistory,
      moduleContext,
      topicContext,
      userProfile
    });

    return sendSuccess(res, tutorResponse);
  } catch (err) {
    return sendError(res, 'AI Tutor service encountered an error', 500, err);
  }
}
