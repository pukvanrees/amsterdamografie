import { formatDistance } from "../utils/geo";

const TIER_LABEL_KEY = {
  correct: "tierCorrect",
  close: "tierClose",
  wrong: "tierWrong",
};

export default function QuizHUD({
  current,
  index,
  total,
  score,
  awaitingAnswer,
  lastResult,
  onNext,
  onQuit,
  t,
}) {
  return (
    <div className="overlay-panel quiz-panel">
      <div className="quiz-header">
        <button className="quit-btn" onClick={onQuit} title="Stop quiz">
          &larr;
        </button>
        <div className="progress-text">{t.question(index + 1, total)}</div>
        <div className="score-text">{t.score(score)}</div>
      </div>

      {awaitingAnswer ? (
        <>
          <p className="prompt-label">{t.whereIsPrompt}</p>
          <h2 className="prompt-name">{current.name}</h2>
          <p className="hint">{t.clickHint}</p>
        </>
      ) : (
        lastResult && (
          <div className={`result result-${lastResult.tier}`}>
            <h2 className="prompt-name">{current.name}</h2>
            <p className="result-tier-label">{t[TIER_LABEL_KEY[lastResult.tier]]}</p>
            <p className="result-distance">
              {t.resultDistance(formatDistance(lastResult.distance), lastResult.area)}
            </p>
            <button className="primary-btn" onClick={onNext}>
              {index + 1 >= total ? t.viewResult : t.next}
            </button>
          </div>
        )
      )}
    </div>
  );
}
