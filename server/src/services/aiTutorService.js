import { openai, isOpenAIConfigured, OPENAI_MODEL } from '../config/openai.js';
import { getLocalCurriculum } from '../config/supabase.js';

export async function askAiTutor({
  message,
  conversationHistory = [],
  moduleContext = null,
  topicContext = null,
  userProfile = {}
}) {
  const goal = userProfile.learning_goal || 'Full Stack Web Development';
  const weakTopics = userProfile.weakTopics || [];

  const systemPrompt = `You are "Qstream AI Tutor" — a world-class, empathetic, highly technical AI mentor specialized in developer education.
Your student is targeting: "${goal}".
${moduleContext ? `Current Module: "${moduleContext.title}" (${moduleContext.topic} - ${moduleContext.subtopic})` : ''}
${topicContext ? `Current Topic: "${topicContext}"` : ''}
${weakTopics.length > 0 ? `Student's identified weak areas: ${weakTopics.join(', ')}` : ''}

Guidelines for responses:
1. Explain concepts concisely with clarity. Avoid fluff.
2. Provide clean, production-ready syntax and code snippets with explanations.
3. If the user asks for a beginner explanation, use intuitive real-world analogies.
4. If the user asks "Quiz me", generate a mini question with 4 options and wait for their answer.
5. If the user asks why they got a question wrong, analyze the underlying principle.
6. Use GitHub-flavored Markdown for code blocks and bold key terms.`;

  if (isOpenAIConfigured) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: message }
      ];

      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1200
      });

      return {
        reply: response.choices[0]?.message?.content || 'I am ready to help. What would you like to explore next?',
        source: 'openai'
      };
    } catch (err) {
      console.warn('[AI Tutor] OpenAI call error, switching to contextual engine:', err.message);
    }
  }

  // Fallback Contextual Tutor Engine
  return generateContextualTutorReply(message, moduleContext, topicContext);
}

function generateContextualTutorReply(message, moduleContext, topicContext) {
  const q = message.toLowerCase();
  const curriculum = getLocalCurriculum();

  // Check if student asked for code / example
  if (q.includes('example') || q.includes('code') || q.includes('syntax')) {
    return {
      reply: `### Practical Code Implementation\n\nHere is an idiomatic example demonstrating best practices:\n\n\`\`\`javascript\n// Safe and structured implementation\nexport async function executeOperation(config) {\n  try {\n    if (!config) throw new Error('Missing configuration payload');\n    \n    // Process operation with error boundary\n    const data = await fetchDetails(config.id);\n    return { success: true, result: data };\n  } catch (error) {\n    console.error('Operation failed:', error.message);\n    return { success: false, error: error.message };\n  }\n}\n\`\`\`\n\n**Key Takeaways:**\n- Always validate inputs prior to processing.\n- Handle asynchronous rejections cleanly.\n- Return structured response shapes for predictable downstream consumption.`,
      source: 'local_engine'
    };
  }

  // Check if student asked "why did i get this wrong"
  if (q.includes('why') && (q.includes('wrong') || q.includes('mistake'))) {
    return {
      reply: `### Analyzing Common Pitfalls\n\nWhen working in this domain, errors usually arise from three common traps:\n1. **Shared State Mutation:** Modifying objects or state in-place instead of creating immutable copies.\n2. **Lifecycle or Asynchronous Race Conditions:** Relying on variable timing instead of explicit promise coordination or locks.\n3. **Edge Case Boundaries:** Forgetting to handle \`null\`, empty collections, or network disconnection states.\n\nTake a moment to review the execution order and verify your assumptions against the formal specification!`,
      source: 'local_engine'
    };
  }

  // Check if student asked to be quizzed
  if (q.includes('quiz me') || q.includes('test me')) {
    return {
      reply: `### Quick Diagnostic Check\n\nHere is a quick question to test your understanding:\n\n**Question:** What is the primary benefit of maintaining pure functions and immutable state in application architecture?\n\n- **A)** It guarantees zero CPU utilization.\n- **B)** It makes state transitions predictable, easily testable, and prevents unintended side-effects.\n- **C)** It bypasses the need for database indexing.\n- **D)** It eliminates network latency completely.\n\nReply with your answer (A, B, C, or D) and I will evaluate it!`,
      source: 'local_engine'
    };
  }

  // Default contextual mentor reply
  const currentTopic = topicContext || (moduleContext ? moduleContext.topic : 'Software Engineering');
  return {
    reply: `### Understanding ${currentTopic}\n\nGreat question regarding **${currentTopic}**!\n\nIn modern software architecture, mastering this concept requires understanding two fundamental aspects:\n\n1. **Core Mechanism**: How the underlying runtime or database manages resources (allocating memory, indexing lookups, or executing event loops).\n2. **Design Tradeoffs**: The engineering balance between latency, memory consumption, and developer ergonomics.\n\nWould you like me to:\n- Break this down with a beginner analogy?\n- Show a real-world code walkthrough?\n- Quiz you to test your mastery?`,
    source: 'local_engine'
  };
}
