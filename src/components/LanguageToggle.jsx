export default function LanguageToggle({ language, onChange }) {
  return (
    <div className="language-toggle">
      <button
        className={`lang-btn ${language === "nl" ? "lang-btn-active" : ""}`}
        onClick={() => onChange("nl")}
      >
        NL
      </button>
      <button
        className={`lang-btn ${language === "en" ? "lang-btn-active" : ""}`}
        onClick={() => onChange("en")}
      >
        ENG
      </button>
    </div>
  );
}
