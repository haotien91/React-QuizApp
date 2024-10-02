import { useState } from 'react';
import { marked } from 'marked';

function CreateQuiz({ dispatch }) {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');

  const addQuestion = () => {
    if (currentQuestion && currentAnswer) {
      setQuestions([
        ...questions,
        {
          question: currentQuestion,
          correctAnswer: currentAnswer,
          type: 'open-ended',
        },
      ]);
      setCurrentQuestion('');
      setCurrentAnswer('');
    }
  };

  const handleSaveQuiz = () => {
    if (quizName && questions.length > 0) {
      const newQuiz = {
        name: quizName,
        questions: questions,
      };
      dispatch({ type: 'addQuestionSet', payload: newQuiz });
      dispatch({ type: 'finishCreating' });
    } else {
      alert('Please provide a quiz name and at least one question.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const markdownContent = e.target.result;
        const htmlContent = marked(markdownContent);
  
        // Parsing logic for your specific format
        // Example format:
        // # Quiz Title
        // ## Q1
        // (Question text)
        // ### A1
        // (Answer text)
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract the quiz title from the first `h1` element
        const quizTitleElem = doc.querySelector('h1');
        const quizTitle = quizTitleElem ? quizTitleElem.textContent.trim() : 'Untitled Quiz';
  
        // Extract all questions and answers
        const questionElements = doc.querySelectorAll('h2');
        const parsedQuestions = [];
  
        questionElements.forEach((elem) => {
          const questionText = elem.nextElementSibling?.textContent.trim();
          const answerElem = elem.nextElementSibling?.nextElementSibling;
          const answerText = answerElem && answerElem.tagName.toLowerCase() === 'h3'
            ? answerElem.nextElementSibling?.textContent.trim()
            : '';
  
          if (questionText && answerText) {
            parsedQuestions.push({
              question: questionText,
              correctAnswer: answerText,
              type: 'open-ended',
            });
          }
        });
  
        if (parsedQuestions.length > 0) {
          const newQuiz = {
            name: quizTitle,
            questions: parsedQuestions,
          };
          dispatch({ type: 'addQuestionSet', payload: newQuiz });
          localStorage.setItem('quizData', JSON.stringify(newQuiz));
          dispatch({ type: 'finishCreating' });
        } else {
          alert('No valid questions found in the Markdown file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="create-quiz">
      <h2>Create a New Quiz</h2>
      <div className="quiz-input">
        <label>Quiz Name</label>
        <input
          type="text"
          placeholder="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
      </div>
      <div className="quiz-input">
        <label>Question</label>
        <input
          type="text"
          placeholder="Question"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
        />
      </div>
      <div className="quiz-input">
        <label>Upload Markdown</label>
        <input
          type="file"
          accept=".md, .markdown"
          onChange={handleFileUpload}
        />
      </div>
      <button className="btn btn-ui" onClick={addQuestion}>
        Add Question
      </button>
      <h3>Questions:</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>{q.question}</li>
        ))}
      </ul>
      <button onClick={handleSaveQuiz}>Save Quiz</button>
      <button onClick={() => dispatch({ type: 'finishCreating' })}>
        Cancel
      </button>
    </div>
  );
}

export default CreateQuiz;