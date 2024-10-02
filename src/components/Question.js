import { useState } from 'react';

function Question({ question, dispatch, answer, feedback }) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    dispatch({ type: 'submitAnswer', payload: userInput });
  };

  return (
    <div className="question_container">
      <h4>{question.question}</h4>
      <div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={answer !== null}
          className="input-field"
          rows="4"
          cols="50"
        ></textarea>
        <button onClick={handleSubmit} disabled={answer !== null}>
          Submit
        </button>
      </div>
      {feedback && <div className="feedback-message">{feedback}</div>}
    </div>
  );
}

export default Question;
