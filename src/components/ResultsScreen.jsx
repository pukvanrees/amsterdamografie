import { formatDistance } from "../utils/geo";

const SAVE_STATUS_KEY = {
  saving: "saving",
  saved: "saved",
  error: "saveError",
};

export default function ResultsScreen({ answers, onRestart, onReview, onShowLeaderboard, saveStatus, t }) {
  const total = answers.length;
  const correct = answers.filter((a) => a.tier === "correct").length;
  const close = answers.filter((a) => a.tier === "close").length;
  const missed = answers.filter((a) => a.tier !== "correct");

  return (
    <div className="overlay-panel results-panel">
      <h1>{t.resultTitle}</h1>
      <p className="score-summary">
        {t.scoreSummary(correct, total)}
        {close > 0 && <span className="close-note"> &middot; {t.closeNote(close)}</span>}
      </p>

      {saveStatus && <p className="subtitle save-status">{t[SAVE_STATUS_KEY[saveStatus]]}</p>}

      {missed.length > 0 && (
        <div className="missed-list">
          <span className="option-label">{t.practiceMore}</span>
          <ul>
            {missed.map((a) => (
              <li key={a.id}>
                <span className="missed-name">{a.name}</span>
                <span className="missed-distance">{formatDistance(a.distance)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="option-row">
        <button className="primary-btn" onClick={onRestart}>
          {t.restart}
        </button>
        {missed.length > 0 && (
          <button className="secondary-btn" onClick={() => onReview(missed)}>
            {t.practiceMissed}
          </button>
        )}
      </div>
      <button className="secondary-btn full-width" onClick={onShowLeaderboard}>
        {t.viewLeaderboard}
      </button>
    </div>
  );
}
