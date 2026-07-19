import { useState } from "react";

function lengthOptionsFor(max) {
  if (max >= 50) return [10, 25, 50];
  const mid = max >= 20 ? 15 : Math.max(5, Math.round(max / 2 / 5) * 5);
  return Array.from(new Set([10, mid, max])).filter((n) => n <= max);
}

export default function StartScreen({ module, onBack, onStart, bestScore, nickname, onNicknameChange, onShowLeaderboard, t }) {
  const maxLength = module.locationIds.length;
  const lengthOptions = lengthOptionsFor(maxLength);
  const [length, setLength] = useState(lengthOptions[lengthOptions.length - 1]);
  const [filter, setFilter] = useState("all");
  const canStart = nickname.trim().length > 0;

  const filterOptions = [
    { value: "all", label: t.filterAll },
    { value: "street", label: t.filterStreet },
    { value: "square", label: t.filterSquare },
  ];

  return (
    <div className="overlay-panel start-panel">
      <button className="back-link" onClick={onBack}>
        {t.backToModules}
      </button>
      <h1>{module.name}</h1>
      <p className="subtitle">{t.startSubtitle}</p>

      <div className="option-group">
        <span className="option-label">{t.yourName}</span>
        <input
          className="text-input"
          type="text"
          maxLength={24}
          placeholder={t.nicknamePlaceholder}
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
        />
      </div>

      <div className="option-group">
        <span className="option-label">{t.numberOfQuestions}</span>
        <div className="option-row">
          {lengthOptions.map((n) => (
            <button
              key={n}
              className={`chip ${length === n ? "chip-active" : ""}`}
              onClick={() => setLength(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <span className="option-label">{t.category}</span>
        <div className="option-row">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${filter === opt.value ? "chip-active" : ""}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {bestScore != null && <p className="best-score">{t.bestScore(bestScore)}</p>}

      <button className="primary-btn" disabled={!canStart} onClick={() => onStart({ length, filter })}>
        {t.startQuiz}
      </button>
      <button className="secondary-btn full-width" onClick={onShowLeaderboard}>
        {t.leaderboardBtn}
      </button>
    </div>
  );
}
