import { useStore } from "../store/useStore";
import { resolveLocalizedSelection, useT } from "../i18n";

export function InfoPanel() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const selectedId = useStore((s) => s.selectedId);
  const orbitId = useStore((s) => s.orbitId);
  const select = useStore((s) => s.select);
  const enterOrbit = useStore((s) => s.enterOrbit);
  const exitOrbit = useStore((s) => s.exitOrbit);
  const body = resolveLocalizedSelection(selectedId, locale);

  const inOrbit = body != null && orbitId === body.id;
  const showEn = locale === "zh";

  return (
    <div className={`info-panel ${body ? "open" : ""}`}>
      <button className="close" onClick={() => select(null)} aria-label={t("close")}>
        ×
      </button>
      {body && (
        <>
          <span className="tag">{body.tag}</span>
          <h2>{body.name}</h2>
          {showEn && <div className="en">{body.nameEn}</div>}
          <p className="desc">{body.description}</p>
          <div className="facts">
            {body.facts.map((f) => (
              <div className="fact" key={f.k}>
                <div className="k">{f.k}</div>
                <div className="v">{f.v}</div>
              </div>
            ))}
          </div>

          {body.canOrbit && (
            <div className="orbit-actions">
              {inOrbit ? (
                <button className="orbit-btn ghost" onClick={exitOrbit}>
                  {t("info.exitOrbit")}
                </button>
              ) : (
                <button
                  className="orbit-btn"
                  onClick={() => enterOrbit(body.id)}
                >
                  {t("info.enterOrbit", { name: body.name })}
                </button>
              )}

              {inOrbit && !body.isMoon && body.isExo && (
                <p className="orbit-hint">
                  {t("info.hintExo", { name: body.name })}
                </p>
              )}
              {inOrbit && !body.isMoon && !body.isExo && (
                <p className="orbit-hint">
                  {t("info.hintPlanet", { name: body.name })}
                </p>
              )}
              {inOrbit && body.isMoon && (
                <p className="orbit-hint">
                  {t("info.hintMoon", {
                    name: body.name,
                    parent: body.parentName
                      ? t("info.moonParent", { parent: body.parentName })
                      : "",
                    parentStar: body.parentName ?? t("info.parentStar"),
                  })}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
