import { useEffect, useState } from "react";
import { fetchTopScores } from "../lib/scores";

const CATEGORY_LABELS = {
  all: "Straten & pleinen",
  street: "Alleen straten",
  square: "Alleen pleinen",
};

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchTopScores(10).then(({ scores, error }) => {
      if (cancelled) return;
      setScores(scores);
      setError(error);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overlay-panel results-panel">
      <h1>Scorebord</h1>

      {error && <p className="subtitle">Scorebord kon niet geladen worden.</p>}

      {!error && scores == null && <p className="subtitle">Laden...</p>}

      {!error && scores != null && scores.length === 0 && (
        <p className="subtitle">Nog geen scores. Speel een potje om als eerste op het bord te komen.</p>
      )}

      {!error && scores != null && scores.length > 0 && (
        <div className="missed-list">
          <ul>
            {scores.map((s, i) => (
              <li key={i} className="leaderboard-row">
                <div className="leaderboard-main">
                  <span className="missed-name">
                    {i + 1}. {s.nickname}{" "}
                    <span className="close-note">({CATEGORY_LABELS[s.category] ?? s.category})</span>
                  </span>
                  <span className="missed-distance">
                    {s.score} / {s.total}
                  </span>
                </div>
                <span className="leaderboard-date">{formatDateTime(s.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="primary-btn" onClick={onBack}>
        Terug
      </button>
    </div>
  );
}
