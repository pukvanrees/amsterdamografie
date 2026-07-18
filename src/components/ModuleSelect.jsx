export default function ModuleSelect({ modules, onSelect }) {
  return (
    <div className="overlay-panel start-panel">
      <h1>Amsterdamografie</h1>
      <p className="subtitle">
        Test je kennis van de straten en pleinen van Amsterdam. Kies eerst welke module je
        wilt spelen.
      </p>

      <div className="module-list">
        {modules.map((m) => (
          <button key={m.id} className="module-card" onClick={() => onSelect(m.id)}>
            <span className="module-name">{m.name}</span>
            <span className="module-count">{m.locationIds.length} locaties</span>
          </button>
        ))}
      </div>
    </div>
  );
}
