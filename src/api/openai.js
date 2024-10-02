export async function getGptFeedback(question, userAnswer, correctAnswer) {
  const response = await fetch('http://localhost:5000/api/get-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, userAnswer, correctAnswer }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch feedback from server.');
  }

  const data = await response.json();
  return data.feedback;
}
