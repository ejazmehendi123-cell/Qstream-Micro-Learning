import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';

// Helper for making local requests to our running app
let serverInstance;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    const s = app.listen(0, () => {
      serverInstance = s;
      const port = s.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(() => {
  if (serverInstance) serverInstance.close();
});

test('GET /api/health should return ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.status, 'ok');
});

test('GET /api/learning-paths should return 20+ paths', async () => {
  const res = await fetch(`${baseUrl}/api/learning-paths`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.paths.length >= 20);
  assert.ok(json.data.pagination.total >= 25);
});

test('GET /api/modules should return modules', async () => {
  const res = await fetch(`${baseUrl}/api/modules?limit=10`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.modules.length > 0);
});

test('GET /api/notes/:moduleId should return 12-section notes', async () => {
  const res = await fetch(`${baseUrl}/api/notes/22222222-2222-2222-2222-000000000001`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.content);
  assert.ok(Array.isArray(json.data.key_concepts));
  assert.ok(Array.isArray(json.data.interview_questions));
});

test('POST /api/quizzes/generate with invalid or undefined ID should return 400', async () => {
  const res = await fetch(`${baseUrl}/api/quizzes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'undefined' })
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
});

test('POST /api/quizzes/generate should return questions WITHOUT correct answers', async () => {
  const res = await fetch(`${baseUrl}/api/quizzes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: '22222222-2222-2222-2222-000000000001', count: 3 })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.quizId);
  assert.equal(json.data.questions.length, 3);
  // Guarantee correct answer is NOT leaked during quiz
  for (const q of json.data.questions) {
    assert.equal(q.correct_answer, undefined);
    assert.equal(q.correctAnswer, undefined);
  }
});

test('GET /api/leaderboard should return ranked learners', async () => {
  const res = await fetch(`${baseUrl}/api/leaderboard`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  assert.equal(json.data[0].rank, 1);
});

test('GET /api/search?q=javascript should return relevant items', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=javascript`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.total > 0);
});

test('GET /api/certificates/verify/:token should verify certificate authenticity', async () => {
  const res = await fetch(`${baseUrl}/api/certificates/verify/sample-token`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.isValid, true);
});
