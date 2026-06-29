import { useStore } from "../store/useStore";
import { getLocalizedName, useT } from "../i18n";

export function CockpitOverlay() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const shipCam = useStore((s) => s.shipCam);
  const shipTarget = useStore((s) => s.shipTarget);
  const shipDest = useStore((s) => s.shipDest);
  const shipSpeed = useStore((s) => s.shipSpeed);
  const shipDist = useStore((s) => s.shipDist);

  if (shipCam !== "cockpit") return null;

  const cruising = shipDest != null;
  const focus = cruising ? shipDest! : shipTarget;
  const focusName = getLocalizedName(focus, locale);

  return (
    <div className="cockpit" aria-hidden>
      <div className="cockpit-frame" />
      <div className="cockpit-strut left" />
      <div className="cockpit-strut right" />
      <div className="cockpit-dash" />

      <div className="hud-reticle">
        <span className="r-ring" />
        <span className="r-dot" />
      </div>

      <div className="hud-top">
        <span className={`hud-mode ${cruising ? "cruise" : "orbit"}`}>
          {cruising ? t("cockpit.cruising") : t("cockpit.orbiting")}
        </span>
        <span className="hud-dest">{focusName}</span>
      </div>

      <div className="hud-readout left">
        <div className="hud-k">SPEED</div>
        <div className="hud-v">
          {shipSpeed.toFixed(1)}
          <span className="u"> u/s</span>
        </div>
      </div>

      <div className="hud-readout right">
        <div className="hud-k">DIST · {focusName}</div>
        <div className="hud-v">
          {shipDist.toFixed(1)}
          <span className="u"> u</span>
        </div>
      </div>
    </div>
  );
}
