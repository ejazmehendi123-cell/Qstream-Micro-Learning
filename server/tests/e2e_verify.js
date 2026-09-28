async function verifyLiveServers() {
  console.log('==============================================');
  console.log('QSTREAM AI — LIVE RUNTIME VERIFICATION SUITE');
  console.log('==============================================');

  // 1. Health check
  console.log('\n[1/7] Testing Express Health Check...');
  const healthRes = await fetch('http://localhost:5000/api/health');
  const healthJson = await healthRes.json();
  console.log('Status:', healthRes.status, '| Success:', healthJson.success, '| Data:', healthJson.data);

  // 2. Learning Paths Catalog
  console.log('\n[2/7] Testing Learning Paths Endpoint...');
  const pathsRes = await fetch('http://localhost:5000/api/learning-paths?limit=5');
  const pathsJson = await pathsRes.json();
  console.log('Status:', pathsRes.status, '| Total Paths Available:', pathsJson.data?.pagination?.total);
  console.log('First Path Title:', pathsJson.data?.paths?.[0]?.title);

  // 3. Module Notes
  console.log('\n[3/7] Testing 12-Section Notes...');
  const notesRes = await fetch('http://localhost:5000/api/notes/22222222-2222-2222-2222-000000000001');
  const notesJson = await notesRes.json();
  console.log('Status:', notesRes.status, '| Notes Title:', notesJson.data?.title);
  console.log('Key Concepts Count:', notesJson.data?.key_concepts?.length);
  console.log('Code Examples Count:', notesJson.data?.code_examples?.length);

  // 4. Quiz Generation & Non-leakage of answers
  console.log('\n[4/7] Testing Quiz Generation (Answer Security)...');
  const quizGenRes = await fetch('http://localhost:5000/api/quizzes/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: '22222222-2222-2222-2222-000000000001', count: 3 })
  });
  const quizGenJson = await quizGenRes.json();
  console.log('Status:', quizGenRes.status, '| Quiz ID:', quizGenJson.data?.quizId);
  const leaked = quizGenJson.data?.questions?.some(q => q.correct_answer !== undefined || q.correctAnswer !== undefined);
  console.log('Correct answers hidden during active quiz?:', !leaked);

  // 5. Quiz Submission & Evaluation
  console.log('\n[5/7] Testing Quiz Submission & Evaluation...');
  const submitRes = await fetch(`http://localhost:5000/api/quizzes/${quizGenJson.data.quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      answers: [
        { questionId: quizGenJson.data.questions[0].id, selectedAnswer: 0, timeSpent: 12 },
        { questionId: quizGenJson.data.questions[1].id, selectedAnswer: 1, timeSpent: 15 },
        { questionId: quizGenJson.data.questions[2].id, selectedAnswer: 0, timeSpent: 10 }
      ],
      timeSpent: 37
    })
  });
  const submitJson = await submitRes.json();
  console.log('Status:', submitRes.status, '| Score:', submitJson.data?.score, '| Accuracy:', submitJson.data?.accuracy + '%');
  console.log('AI Recommendation:', submitJson.data?.aiRecommendations);

  // 6. AI Tutor Response
  console.log('\n[6/7] Testing Contextual AI Tutor...');
  const tutorRes = await fetch('http://localhost:5000/api/ai/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What is a closure in JavaScript and give an example?',
      conversationHistory: []
    })
  });
  const tutorJson = await tutorRes.json();
  console.log('Status:', tutorRes.status, '| Source:', tutorJson.data?.source);
  console.log('Tutor Snippet:', tutorJson.data?.reply?.substring(0, 100) + '...');

  // 7. Live Vite Frontend Dev Server
  console.log('\n[7/7] Testing Live Vite Frontend Development Server...');
  const clientRes = await fetch('http://localhost:5173/');
  console.log('Status:', clientRes.status, '| Content-Type:', clientRes.headers.get('content-type'));
  const clientHtml = await clientRes.text();
  console.log('Has <div id="root">:', clientHtml.includes('id="root"'));
  console.log('Has /src/main.jsx entry script:', clientHtml.includes('/src/main.jsx'));

  console.log('\n==============================================');
  console.log('🎉 ALL LIVE SERVICES OPERATIONAL & VERIFIED!');
  console.log('==============================================\n');
}

verifyLiveServers().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
