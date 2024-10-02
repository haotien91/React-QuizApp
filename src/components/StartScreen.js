function StartScreen({ dispatch, questionSets = [] }) {
  return (
    <div className="start">
      <h2>Select a Quiz to Start</h2>
      {questionSets.length === 0 ? (
        <p>No quizzes available. Please create one.</p>
      ) : (
        <ul>
          {questionSets.map((quiz, index) => (
            <li key={index}>
              <button
                className="btn btn-ui"
                onClick={() => dispatch({ type: 'selectQuestionSet', payload: quiz })}
              >
                {quiz.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'startCreating' })}
      >
        Create New Quiz
      </button>
    </div>
  );
}

export default StartScreen;
