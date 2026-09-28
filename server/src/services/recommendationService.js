import { getLocalCurriculum } from '../config/supabase.js';

export function getRecommendationsForUser({ userGoal, weakTopics = [], completedPathSlugs = [] }) {
  const curriculum = getLocalCurriculum();
  const allPaths = curriculum.paths || [];

  const goalLower = (userGoal || '').toLowerCase();

  // Score paths based on user goal, weak topics, and completion status
  const scored = allPaths.map(pathItem => {
    let score = 10;
    const pathSlug = pathItem.slug.toLowerCase();
    const pathTitle = pathItem.title.toLowerCase();
    const pathCategory = pathItem.category.toLowerCase();

    // Already completed paths are pushed down
    if (completedPathSlugs.includes(pathItem.slug)) {
      score -= 50;
    }

    // Match learning goal
    if (goalLower.includes('full stack') || goalLower.includes('mern')) {
      if (['full-stack-web-development', 'mern-stack-development', 'javascript-mastery', 'reactjs-developer', 'nodejs-backend-development', 'database-and-sql-mastery', 'git-and-github', 'docker-and-kubernetes', 'system-design-fundamentals'].includes(pathItem.slug)) {
        score += 40;
      }
    } else if (goalLower.includes('python') || goalLower.includes('data')) {
      if (['python-programming', 'python-for-data-science', 'ai-and-machine-learning', 'generative-ai', 'database-and-sql-mastery'].includes(pathItem.slug)) {
        score += 40;
      }
    } else if (goalLower.includes('cloud') || goalLower.includes('devops')) {
      if (['cloud-computing', 'aws-cloud-developer', 'devops-engineering', 'docker-and-kubernetes', 'cybersecurity-fundamentals'].includes(pathItem.slug)) {
        score += 40;
      }
    } else if (goalLower.includes('placement') || goalLower.includes('interview') || goalLower.includes('dsa')) {
      if (['data-structures-and-algorithms', 'java-dsa-for-placements', 'interview-preparation', 'system-design-fundamentals', 'aptitude-and-logical-reasoning', 'resume-and-linkedin-preparation'].includes(pathItem.slug)) {
        score += 40;
      }
    }

    // Boost paths matching user's weak topics
    for (const weak of weakTopics) {
      const wLower = (weak.topic || weak).toLowerCase();
      if (pathTitle.includes(wLower) || pathSlug.includes(wLower) || pathCategory.includes(wLower)) {
        score += 25;
      }
    }

    // Slight randomization for fresh diversity
    score += Math.random() * 5;

    return { ...pathItem, recommendationScore: Math.round(score) };
  });

  return scored.sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 6);
}
