import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import "./FP.css";

const questions = [
  { id: 0, text: "What does CSS stand for?", answers: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 1 },
  { id: 1, text: "The property in CSS used to change the background color of an element is?", answers: ["bgcolor", "color", "background-color", "All of the above"], correct: 2 },
  { id: 2, text: "The property in CSS used to change the text color of an element is?", answers: ["bgcolor", "color", "background-color", "All of the above"], correct: 1 },
  { id: 3, text: "The CSS property used to control the element's font size is?", answers: ["text-style", "font-style", "text-size", "font-size"], correct: 3 }
];

function useCounter(initial) {
  const [value, setValue] = useState(initial);
  return {
    value,
    add: () => setValue(v => v + 1),
    reset: () => setValue(initial)
  };
}

function Question({ data, buttonText, onQuestionButtonClick }) {
  const [answer, setAnswer] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
  }, [data]);

  return (
    <div className="question" ref={ref}>
      <h2 className="question-text">{data.text}</h2>
      <ul className="question-answers">
        {data.answers.map((text, i) => (
          <li key={i}>
            <input
              type="radio"
              name={`q_${data.id}`}
              onChange={() => setAnswer(i)}
            />
            <label>{text}</label>
          </li>
        ))}
      </ul>

      <button
        className="question-button"
        onClick={() => onQuestionButtonClick(answer, data)}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function App() {
  const question = useCounter(0);
  const correct = useCounter(0);
  const wrong = useCounter(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length - 1;

  const handleNext = (selected, q) => {
    if (selected === q.correct) correct.add();
    else wrong.add();
    question.add();

    if (question.value === total) {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    question.reset();
    correct.reset();
    wrong.reset();
    setFinished(false);
  };

  return (
    <div className="game">
      <div className="intro">
        <h1>CSS Quiz</h1>

        {/* PROGRESS */}
        <div className="progress">
  {questions.map((_, i) => (
    <span
      key={i}
      className={`dot 
        ${i < question.value ? "done" : ""} 
        ${i === question.value ? "active" : ""}`}
    ></span>
  ))}
</div>

        <p>Total Questions: {questions.length}</p>
        <p>Correct: {correct.value}</p>
        <p>Wrong: {wrong.value}</p>

        {finished && (
          <button className="restart-btn" onClick={restartQuiz}>
            Restart Quiz
          </button>
        )}
      </div>

      <div className="game-area">
        {questions[question.value] ? (
          <Question
            data={questions[question.value]}
            buttonText={question.value !== total ? "Next Question" : "Finish Quiz"}
            onQuestionButtonClick={handleNext}
          />
        ) : (
          <h2 className="quiz-finished">Quiz Finished 🎉</h2>
        )}
      </div>
    </div>
  );
}