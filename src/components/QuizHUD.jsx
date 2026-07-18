import { formatDistance } from "../utils/geo";

export default function QuizHUD({
  current,
  index,
  total,
  score,
  awaitingAnswer,
  lastResult,
  onNext,
  onQuit,
}) {
  return (
    <div className="overlay-panel quiz-panel">
      <div className="quiz-header">
        <button className="quit-btn" onClick={onQuit} title="Stop quiz">
          &larr;
        </button>
        <div className="progress-text">
          Vraag {index + 1} / {total}
        </div>
        <div className="score-text">Score: {score}</div>
      </div>

      {awaitingAnswer ? (
        <>
          <p className="prompt-label">Waar bevindt zich:</p>
          <h2 className="prompt-name">{current.name}</h2>
          <p className="hint">Klik op de kaart om te antwoorden</p>
        </>
      ) : (
        lastResult && (
          <div className={`result result-${lastResult.tier}`}>
            <h2 className="prompt-name">{current.name}</h2>
            <p className="result-tier-label">
              {lastResult.tier === "correct" && "Correct!"}
              {lastResult.tier === "close" && "Dichtbij!"}
              {lastResult.tier === "wrong" && "Helaas"}
            </p>
            <p className="result-distance">
              Jouw gok was {formatDistance(lastResult.distance)} van de werkelijke locatie
              {lastResult.area ? ` (${lastResult.area})` : ""}.
            </p>
            <button className="primary-btn" onClick={onNext}>
              {index + 1 >= total ? "Bekijk resultaat" : "Volgende"}
            </button>
          </div>
        )
      )}
    </div>
  );
}
