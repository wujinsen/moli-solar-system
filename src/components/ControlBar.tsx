import { useStore } from "../store/useStore";
import { useT } from "../i18n";

export function ControlBar() {
  const t = useT();
  const timeScale = useStore((s) => s.timeScale);
  const setTimeScale = useStore((s) => s.setTimeScale);
  const paused = useStore((s) => s.paused);
  const togglePaused = useStore((s) => s.togglePaused);
  const showOrbits = useStore((s) => s.showOrbits);
  const toggleOrbits = useStore((s) => s.toggleOrbits);
  const bloom = useStore((s) => s.bloom);
  const toggleBloom = useStore((s) => s.toggleBloom);
  const showConstellations = useStore((s) => s.showConstellations);
  const toggleConstellations = useStore((s) => s.toggleConstellations);
  const select = useStore((s) => s.select);

  return (
    <div className="control-bar">
      <button onClick={togglePaused}>
        {paused ? t("control.play") : t("control.pause")}
      </button>
      <span className="speed">
        {timeScale.toFixed(1)}× {t("control.speed")}
      </span>
      <input
        type="range"
        min={0}
        max={8}
        step={0.1}
        value={timeScale}
        onChange={(e) => setTimeScale(parseFloat(e.target.value))}
      />
      <button onClick={toggleOrbits}>
        {showOrbits ? t("control.hideOrbits") : t("control.showOrbits")}
      </button>
      <button onClick={toggleBloom}>
        {bloom ? t("control.bloomOn") : t("control.bloomOff")}
      </button>
      <button onClick={toggleConstellations}>
        {showConstellations ? t("control.constOn") : t("control.constOff")}
      </button>
      <button onClick={() => select(null)}>{t("control.overview")}</button>
    </div>
  );
}
