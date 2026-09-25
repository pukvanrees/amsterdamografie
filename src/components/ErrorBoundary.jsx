import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error, showing fallback UI:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell">
          <div className="overlay-panel start-panel">
            <h1>Er ging iets mis</h1>
            <p className="subtitle">
              Er is een onverwachte fout opgetreden. Herlaad de pagina om verder te gaan.
            </p>
            <button className="primary-btn" onClick={() => window.location.reload()}>
              Herladen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
