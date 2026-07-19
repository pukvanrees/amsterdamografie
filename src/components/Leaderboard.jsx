import { useEffect, useState } from "react";
import { fetchTopScores } from "../lib/scores";

function formatDateTime(iso, locale) {
  return new Date(iso).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Leaderboard({ moduleId, moduleName, onBack, t }) {
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);

  const categoryLabels = { all: t.filterAll, street: t.filterStreet, square: t.filterSquare };

  useEffect(() => {
    let cancelled = false;
    setScores(null);
    setError(null);
    fetchTopScores(moduleId, 10).then(({ scores, error }) => {
      if (cancelled) return;
      setScores(scores);
      setError(error);
    });
    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  return (
    <div className="overlay-panel results-panel">
      <h1>{t.leaderboardTitle(moduleName)}</h1>

      {error && <p className="subtitle">{t.leaderboardError}</p>}

      {!error && scores == null && <p className="subtitle">{t.loading}</p>}

      {!error && scores != null && scores.length === 0 && <p className="subtitle">{t.leaderboardEmpty}</p>}

      {!error && scores != null && scores.length > 0 && (
        <div className="missed-list">
          <ul>
            {scores.map((s, i) => (
              <li key={i} className="leaderboard-row">
                <div className="leaderboard-main">
                  <span className="missed-name">
                    {i + 1}. {s.nickname}{" "}
                    <span className="close-note">({categoryLabels[s.category] ?? s.category})</span>
                  </span>
                  <span className="missed-distance">
                    {s.score} / {s.total}
                  </span>
                </div>
                <span className="leaderboard-date">{formatDateTime(s.created_at, t.dateLocale)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="primary-btn" onClick={onBack}>
        {t.back}
      </button>
    </div>
  );
}
