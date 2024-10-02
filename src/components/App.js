import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import "../index.css";

// 更新
import CreateQuiz from './CreateQuiz';
import { getGptFeedback } from '../api/openai';
import StartQuiz from './StartQuiz';
// 

const SECS_PER_QUESTION = 120;

// We need to define the intialState in order to use useReduce Hook.
const initialState = {
  questionSets: [], // 更新
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished', 'creating'
  status: "initial",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  // 更新 ===
  selectedQuizName: '',
  feedback: null,
  feedbacks: [],
  isTimerEnabled: true, // default value
  // ===
};

function reducer(state, action) {
  switch (action.type) {
    // case "dataReceived":
    //   return {
    //     ...state,
    //     questions: action.payload,
    //     status: "ready",
    //   };
    // case "dataFailed":
    //   return {
    //     ...state,
    //     status: "error",
    //   };
    // 更新 ===
    case "loadQuestionSets":
      return {
        ...state,
        questionSets: action.payload,
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        index: 0,
        answer: null,
        points: 0,
        feedback: null,
        feedbacks: [],
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    // ===
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    // 更新 ===
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null, feedback: null };
    case 'toggleTimer':
      return { ...state, isTimerEnabled: !state.isTimerEnabled };
    // ===
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    // 更新 ===
    case 'startCreating':
      return { ...state, status: 'creating' };
      case 'finishCreating':
        return { ...state, status: 'initial' };

    case 'addQuestionSet':
      return {
        ...state,
        questionSets: [...state.questionSets, action.payload],
      };
    case 'selectQuestionSet':
      return {
        ...state,
        questions: action.payload.questions,
        selectedQuizName: action.payload.name,
        status: 'ready',
      };
    case 'startCreating':
      return { ...state, status: 'creating' };
    case 'finishCreating':
      return { ...state, status: 'initial' };
    case 'submitAnswer':
      return { ...state, answer: action.payload };
    case 'receiveFeedback':
      return {
        ...state,
        feedback: action.payload.feedback,
        feedbacks: [
          ...state.feedbacks,
          { userAnswer: state.answer, feedback: action.payload.feedback },
        ],
      };
    // ===

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.secondsRemaining === 0
            ? state.points > state.highscore
              ? state.points
              : state.highscore
            : state.highscore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unkonwn");
  }
}

export default function App() {
  // 更新
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    feedback,
    feedbacks,
    questionSets,
    selectedQuizName, // Add this line
    isTimerEnabled, // Add this line
  } = state;  // 

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  // useEffect(function () {
  //   fetch("https://vinayak9669.github.io/React_quiz_api/questions.json")
  //     .then((res) => res.json())
  //     .then((data) =>
  //       dispatch({
  //         type: "dataReceived",
  //         payload: data["questions"],
  //       })
  //     )
  //     .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);

  // 更新 ===
  useEffect(() => {
    const savedQuestionSets = JSON.parse(localStorage.getItem('questionSets')) || [];
    dispatch({ type: 'loadQuestionSets', payload: savedQuestionSets });
  }, []);
  // ===

  // 更新 ===
  useEffect(() => {
    localStorage.setItem('questionSets', JSON.stringify(state.questionSets));
  }, [state.questionSets]);

  useEffect(() => {
    if (answer !== null && feedback === null) {
      const fetchFeedback = async () => {
        try {
          const feedbackResponse = await getGptFeedback(
            questions[index],
            answer,
            questions[index].correctAnswer
          );
          dispatch({ type: 'receiveFeedback', payload: { feedback: feedbackResponse } });
        } catch (error) {
          console.error(error);
          dispatch({ type: 'receiveFeedback', payload: { feedback: 'Error fetching feedback.' } });
        }
      };
      fetchFeedback();
    }
  }, [answer, feedback, dispatch, questions, index]);
  // ===

  // 更新 ===
  if (status === 'initial') {
    return <StartScreen dispatch={dispatch} questionSets={questionSets} />;
  } else if (status === 'creating') {
    return <CreateQuiz dispatch={dispatch} />;
  } else if (status === 'ready') {
    return (
      <div>
        <StartQuiz
          dispatch={dispatch}
          quizName={selectedQuizName}
          numQuestions={numQuestions}
        />
        <label>
          <input
            type="checkbox"
            checked={isTimerEnabled}
            onChange={() => dispatch({ type: 'toggleTimer' })}
          />
          Enable Timer
        </label>
      </div>
    );
  } else if (status === 'loading') {
    // Include Loader here
    return (
      <div className="wrapper">
        <div className="app">
          <Header />
          <Main>
            <Loader />
          </Main>
        </div>
      </div>
    );
  } else if (status === 'error') {
    // Include Error component if needed
    return (
      <div className="wrapper">
        <div className="app">
          <Header />
          <Main>
            <Error />
          </Main>
        </div>
      </div>
    );
  } else {
  // ===
    return (
      <div className="wrapper">
        <div className="app">
          <div className="headerWrapper">
            <Header />

            <Main>
              {status === "active" && (
                <>
                  <Progress
                    index={index}
                    numQuestions={numQuestions}
                    points={points}
                    maxPossiblePoints={maxPossiblePoints}
                    answer={answer}
                  />
                  {/* 更新 */}
                  <Question
                    question={questions[index]}
                    dispatch={dispatch}
                    answer={answer}
                    feedback={feedback}
                  />
                  {/*  */}
                  {/* 更新 */}
                  <Footer>
                    {isTimerEnabled && (
                      <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} isTimerEnabled={isTimerEnabled} />
                    )}
                    {answer !== null && (
                      <NextButton
                        dispatch={dispatch}
                        answer={answer}
                        numQuestions={numQuestions}
                        index={index}
                      />
                    )}
                  </Footer>
                  {/*  */}
                </>
              )}
              {status === "finished" && (
                // 更新 ===
                <FinishScreen
                  points={points}
                  maxPossiblePoints={maxPossiblePoints}
                  highscore={highscore}
                  feedbacks={feedbacks}
                  questions={questions}
                  dispatch={dispatch}
                />
                // ===
              )}
            </Main>
          </div>
        </div>
      </div>
    );
  }
}
