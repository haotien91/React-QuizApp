// 更新
// src/components/StartQuiz.js 
function StartQuiz({ dispatch, quizName, numQuestions }) {
  return (
    <div className="start">
      <h2>{quizName}</h2>
      <h3>{numQuestions} Questions</h3>
      <label>
          <input
            type="checkbox"
            onChange={() => dispatch({ type: 'toggleTimer' })}
          />
          Enable Timer
      </label>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Start Quiz
      </button>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Back to Quiz Selection
      </button>
    </div>
  );
}

export default StartQuiz;
  