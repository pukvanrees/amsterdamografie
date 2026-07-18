import { formatDistance } from "../utils/geo";

const SAVE_STATUS_TEXT = {
  saving: "Score opslaan...",
  saved: "Score opgeslagen op het scorebord.",
  error: "Score kon niet opgeslagen worden.",
};

export default function ResultsScreen({ answers, onRestart, onReview, onShowLeaderboard, saveStatus }) {
  const total = answers.length;
  const correct = answers.filter((a) => a.tier === "correct").length;
  const close = answers.filter((a) => a.tier === "close").length;
  const missed = answers.filter((a) => a.tier !== "correct");

  return (
    <div className="overlay-panel results-panel">
      <h1>Resultaat</h1>
      <p className="score-summary">
        {correct} / {total} correct
        {close > 0 && <span className="close-note"> &middot; {close} dichtbij</span>}
      </p>

      {saveStatus && <p className="subtitle save-status">{SAVE_STATUS_TEXT[saveStatus]}</p>}

      {missed.length > 0 && (
        <div className="missed-list">
          <span className="option-label">Nog even oefenen</span>
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
          Nog een keer
        </button>
        {missed.length > 0 && (
          <button className="secondary-btn" onClick={() => onReview(missed)}>
            Oefen gemiste locaties
          </button>
        )}
      </div>
      <button className="secondary-btn full-width" onClick={onShowLeaderboard}>
        Bekijk scorebord
      </button>
    </div>
  );
}
