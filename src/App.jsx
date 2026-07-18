import { useState, useCallback, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import MapView from "./components/MapView";
import ModuleSelect from "./components/ModuleSelect";
import StartScreen from "./components/StartScreen";
import QuizHUD from "./components/QuizHUD";
import ResultsScreen from "./components/ResultsScreen";
import Leaderboard from "./components/Leaderboard";
import { LOCATIONS } from "./data/locations";
import { MODULES, getModuleLocations } from "./data/modules";
import { distanceToPath } from "./utils/geo";
import { getNickname, setNickname as persistNickname } from "./lib/nickname";
import { saveScore } from "./lib/scores";
import "./App.css";

const CORRECT_THRESHOLD_M = 200;
const CLOSE_THRESHOLD_M = 450;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQueue(pool, { length, filter }) {
  const filtered = filter === "all" ? pool : pool.filter((l) => l.type === filter);
  return shuffle(filtered).slice(0, Math.min(length, filtered.length));
}

function tierFor(distance) {
  if (distance <= CORRECT_THRESHOLD_M) return "correct";
  if (distance <= CLOSE_THRESHOLD_M) return "close";
  return "wrong";
}

export default function App() {
  const [phase, setPhase] = useState("module");
  const [prevPhase, setPrevPhase] = useState("module");
  const [moduleId, setModuleId] = useState(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [guess, setGuess] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [nickname, setNickname] = useState(getNickname);
  const [category, setCategory] = useState("all");
  const [saveStatus, setSaveStatus] = useState(null);

  const module = useMemo(() => MODULES.find((m) => m.id === moduleId) ?? null, [moduleId]);
  const modulePool = useMemo(() => (module ? getModuleLocations(module.id) : []), [module]);

  const awaitingAnswer = phase === "quiz" && guess === null;
  const current = queue[index];

  const handleNicknameChange = useCallback((value) => {
    setNickname(value);
    persistNickname(value);
  }, []);

  const handleSelectModule = useCallback((id) => {
    setModuleId(id);
    setBestScore(null);
    setPhase("start");
  }, []);

  const handleBackToModules = useCallback(() => {
    setModuleId(null);
    setPhase("module");
  }, []);

  const handleStart = useCallback(
    (options) => {
      const q = buildQueue(modulePool, options);
      setQueue(q);
      setIndex(0);
      setScore(0);
      setAnswers([]);
      setGuess(null);
      setLastResult(null);
      setCategory(options.filter);
      setSaveStatus(null);
      setPhase("quiz");
    },
    [modulePool]
  );

  const handleReview = useCallback((missed) => {
    const q = shuffle(missed.map((m) => LOCATIONS.find((l) => l.id === m.id)).filter(Boolean));
    setQueue(q);
    setIndex(0);
    setScore(0);
    setAnswers([]);
    setGuess(null);
    setLastResult(null);
    setCategory("review");
    setSaveStatus(null);
    setPhase("quiz");
  }, []);

  const handleMapClick = useCallback(
    (latlng) => {
      if (!awaitingAnswer || !current) return;
      const { distance, nearest } = distanceToPath(latlng, current.coords);
      const tier = tierFor(distance);
      setGuess(latlng);
      setLastResult({ tier, distance, area: current.area, nearest });
      setAnswers((prev) => [...prev, { id: current.id, name: current.name, tier, distance }]);
      if (tier === "correct") setScore((s) => s + 1);
    },
    [awaitingAnswer, current]
  );

  const handleNext = useCallback(() => {
    if (index + 1 >= queue.length) {
      const finalScore = score;
      setBestScore((prev) => (prev == null ? finalScore : Math.max(prev, finalScore)));
      setPhase("results");
      setSaveStatus("saving");
      saveScore({ nickname, score: finalScore, total: queue.length, category, module: moduleId }).then(
        ({ error }) => {
          setSaveStatus(error ? "error" : "saved");
        }
      );
      return;
    }
    setIndex((i) => i + 1);
    setGuess(null);
    setLastResult(null);
  }, [index, queue.length, score, nickname, category, moduleId]);

  const handleQuit = useCallback(() => {
    setPhase("start");
    setGuess(null);
    setLastResult(null);
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setPrevPhase(phase);
    setPhase("leaderboard");
  }, [phase]);

  const handleBackFromLeaderboard = useCallback(() => {
    setPhase(prevPhase);
  }, [prevPhase]);

  return (
    <div className="app-shell">
      <MapView
        onMapClick={handleMapClick}
        awaitingAnswer={awaitingAnswer}
        guess={guess}
        targetPath={guess ? current?.coords : null}
        nearestPoint={lastResult?.nearest ?? null}
        questionId={current?.id}
      />

      {phase === "module" && <ModuleSelect modules={MODULES} onSelect={handleSelectModule} />}

      {phase === "start" && module && (
        <StartScreen
          module={module}
          onBack={handleBackToModules}
          onStart={handleStart}
          bestScore={bestScore}
          nickname={nickname}
          onNicknameChange={handleNicknameChange}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}

      {phase === "quiz" && current && (
        <QuizHUD
          current={current}
          index={index}
          total={queue.length}
          score={score}
          awaitingAnswer={awaitingAnswer}
          lastResult={lastResult}
          onNext={handleNext}
          onQuit={handleQuit}
        />
      )}

      {phase === "results" && (
        <ResultsScreen
          answers={answers}
          onRestart={handleQuit}
          onReview={handleReview}
          onShowLeaderboard={handleShowLeaderboard}
          saveStatus={saveStatus}
        />
      )}

      {phase === "leaderboard" && module && (
        <Leaderboard moduleId={module.id} moduleName={module.name} onBack={handleBackFromLeaderboard} />
      )}
    </div>
  );
}
