
// 更新 ===
function FinishScreen({ points, maxPossiblePoints, highscore, feedbacks, questions, dispatch }) {
  // ===
  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <div className="result_container">
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{' '}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <div className="feedback-summary">
        {questions.map((question, index) => (
          <div key={index}>
            <h4>
              Question {index + 1}: {question.question}
            </h4>
            <p>
              <strong>Your Answer:</strong> {feedbacks[index]?.userAnswer || 'N/A'}
            </p>
            <p>
              <strong>Feedback:</strong> {feedbacks[index]?.feedback || 'No feedback available.'}
            </p>
          </div>
        ))}
      </div>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart quiz
      </button>
    </div>
  );
}

export default FinishScreen;