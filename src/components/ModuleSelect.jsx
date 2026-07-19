export default function ModuleSelect({ modules, onSelect, t }) {
  return (
    <div className="overlay-panel start-panel">
      <h1>{t.appTitle}</h1>
      <p className="subtitle">{t.moduleSelectSubtitle}</p>

      <div className="module-list">
        {modules.map((m) => (
          <button key={m.id} className="module-card" onClick={() => onSelect(m.id)}>
            <span className="module-name">{m.name}</span>
            <span className="module-count">{t.locationsCount(m.locationIds.length)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
