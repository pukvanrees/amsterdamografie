import { useState } from "react";

const LENGTH_OPTIONS = [10, 25, 50];
const FILTER_OPTIONS = [
  { value: "all", label: "Straten & pleinen" },
  { value: "street", label: "Alleen straten" },
  { value: "square", label: "Alleen pleinen" },
];

export default function StartScreen({ onStart, bestScore, nickname, onNicknameChange, onShowLeaderboard }) {
  const [length, setLength] = useState(25);
  const [filter, setFilter] = useState("all");
  const canStart = nickname.trim().length > 0;

  return (
    <div className="overlay-panel start-panel">
      <h1>Amsterdamografie</h1>
      <p className="subtitle">
        Test je kennis van de top 50 straten en pleinen van Amsterdam. Je krijgt een naam
        te zien &mdash; klik op de kaart waar jij denkt dat die zich bevindt.
      </p>

      <div className="option-group">
        <span className="option-label">Jouw naam</span>
        <input
          className="text-input"
          type="text"
          maxLength={24}
          placeholder="Bijnaam"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
        />
      </div>

      <div className="option-group">
        <span className="option-label">Aantal vragen</span>
        <div className="option-row">
          {LENGTH_OPTIONS.map((n) => (
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
        <span className="option-label">Categorie</span>
        <div className="option-row">
          {FILTER_OPTIONS.map((opt) => (
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

      {bestScore != null && (
        <p className="best-score">Beste score deze sessie: {bestScore}</p>
      )}

      <button className="primary-btn" disabled={!canStart} onClick={() => onStart({ length, filter })}>
        Start quiz
      </button>
      <button className="secondary-btn full-width" onClick={onShowLeaderboard}>
        Scorebord
      </button>
    </div>
  );
}
