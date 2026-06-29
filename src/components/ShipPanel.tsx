import { useStore } from "../store/useStore";
import { getLocalizedName, useT } from "../i18n";

const DESTINATIONS = [
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;

export function ShipPanel() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const selectedId = useStore((s) => s.selectedId);
  const activeSystem = useStore((s) => s.activeSystem);
  const shipTarget = useStore((s) => s.shipTarget);
  const shipDest = useStore((s) => s.shipDest);
  const shipCam = useStore((s) => s.shipCam);
  const launchShip = useStore((s) => s.launchShip);
  const setShipCam = useStore((s) => s.setShipCam);
  const select = useStore((s) => s.select);

  const open = selectedId === "ship" && activeSystem === "solar";
  if (!open) return null;

  const cruising = shipDest != null;
  const statusText = cruising
    ? t("sidebar.shipCruising", { target: getLocalizedName(shipDest!, locale) })
    : t("sidebar.shipOrbiting", {
        target: getLocalizedName(shipTarget, locale),
      });

  return (
    <div className="info-panel ship-panel open">
      <button className="close" onClick={() => select(null)} aria-label={t("close")}>
        ×
      </button>

      <span className="tag">{t("ship.tag")}</span>
      <h2>{t("ship.name")}</h2>
      <div className="en">{t("ship.subtitle")}</div>

      <div className="ship-status">
        <span className={`ship-dot ${cruising ? "cruise" : "orbit"}`} />
        {statusText}
      </div>

      <p className="desc">{t("ship.desc")}</p>

      <div className="ship-dests">
        {DESTINATIONS.map((id) => {
          const isHere = !cruising && shipTarget === id;
          const isGoing = shipDest === id;
          return (
            <button
              key={id}
              className={`dest-btn ${isHere ? "here" : ""} ${
                isGoing ? "going" : ""
              }`}
              disabled={isHere || isGoing}
              onClick={() => launchShip(id)}
            >
              <span className="dest-name">{getLocalizedName(id, locale)}</span>
              <span className="dest-state">
                {isHere
                  ? t("ship.destCurrent")
                  : isGoing
                  ? t("ship.destGoing")
                  : t("ship.destGo")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="ship-cam-section">
        <div className="ship-cam-label">{t("ship.camLabel")}</div>
        <div className="ship-cam-row">
          <button
            className={`cam-btn ${shipCam === "chase" ? "on" : ""}`}
            onClick={() => setShipCam(shipCam === "chase" ? "none" : "chase")}
          >
            {t("ship.camChase")}
          </button>
          <button
            className={`cam-btn ${shipCam === "cockpit" ? "on" : ""}`}
            onClick={() =>
              setShipCam(shipCam === "cockpit" ? "none" : "cockpit")
            }
          >
            {t("ship.camCockpit")}
          </button>
        </div>
        {shipCam !== "none" && (
          <button className="cam-exit" onClick={() => setShipCam("none")}>
            {t("ship.camExit")}
          </button>
        )}
      </div>
    </div>
  );
}
