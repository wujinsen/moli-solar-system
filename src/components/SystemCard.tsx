import { useStore } from "../store/useStore";
import { findSystem } from "../data/systems";
import { findBlackHole } from "../data/blackholes";
import {
  SOLAR_BRIEF,
  getBlackHoleCategoryLabel,
  getLocalizedName,
  useT,
  tf,
} from "../i18n";
import type { Locale } from "../i18n/types";

function localizeFacts(
  facts: { k: string; v: string }[],
  locale: Locale
): { k: string; v: string }[] {
  if (locale === "zh") return facts;
  return facts.map((f) => ({ k: tf(locale, f.k) || f.k, v: f.v }));
}

export function SystemCard() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const activeSystem = useStore((s) => s.activeSystem);
  const targetSystem = useStore((s) => s.targetSystem);
  const selectedId = useStore((s) => s.selectedId);
  const selectedConstellation = useStore((s) => s.selectedConstellation);
  const startWarp = useStore((s) => s.startWarp);
  const selectSystem = useStore((s) => s.selectSystem);
  const warping = useStore((s) => s.warping);

  const previewId =
    targetSystem ?? (activeSystem !== "solar" ? activeSystem : null);
  const atDestination = previewId === activeSystem;
  const open = !!previewId && !selectedId && !selectedConstellation;
  const showEn = locale === "zh";

  if (!open) return null;

  if (previewId === "solar") {
    const s = SOLAR_BRIEF[locale];
    const facts = localizeFacts(s.facts, locale);
    return (
      <div className="info-panel system-card open">
        <button
          className="close"
          onClick={() => selectSystem(null)}
          aria-label={t("close")}
        >
          ×
        </button>
        <span className="tag">{s.tag}</span>
        <h2>{s.name}</h2>
        {showEn && <div className="en">{s.nameEn}</div>}
        <p className="desc">{s.description}</p>
        <div className="facts">
          {facts.map((f) => (
            <div className="fact" key={f.k}>
              <div className="k">{f.k}</div>
              <div className="v">{f.v}</div>
            </div>
          ))}
        </div>
        <div className="orbit-actions">
          <button
            className="orbit-btn"
            disabled={warping}
            onClick={() => startWarp("solar")}
          >
            {t("system.warpToSolar")}
          </button>
        </div>
      </div>
    );
  }

  const blackHole = findBlackHole(previewId);
  if (blackHole) {
    const catLabel = getBlackHoleCategoryLabel(
      blackHole.category,
      blackHole.categoryLabel,
      locale
    );
    const bhName = getLocalizedName(blackHole.id, locale);
    const facts = localizeFacts(blackHole.facts, locale);
    return (
      <div className="info-panel system-card bh-card open">
        {!atDestination && (
          <button
            className="close"
            onClick={() => selectSystem(null)}
            aria-label={t("close")}
          >
            ×
          </button>
        )}
        <span className="tag">{catLabel}</span>
        <h2>{bhName}</h2>
        {showEn && <div className="en">{blackHole.nameEn}</div>}
        <p className="desc">{blackHole.description}</p>
        <div className="facts">
          {facts.map((f) => (
            <div className="fact" key={f.k}>
              <div className="k">{f.k}</div>
              <div className="v">{f.v}</div>
            </div>
          ))}
        </div>

        <div className="orbit-actions">
          {!atDestination ? (
            <>
              <button
                className="orbit-btn"
                disabled={warping}
                onClick={() => startWarp(blackHole.id)}
              >
                {t("system.warpTo", { name: bhName })}
              </button>
              <p className="orbit-hint">{t("system.warpHintBh")}</p>
            </>
          ) : (
            <>
              <p className="orbit-hint">
                {t("system.atDestinationBh", { name: bhName })}
              </p>
              <button
                className="orbit-btn ghost"
                disabled={warping}
                onClick={() => selectSystem("solar")}
              >
                {t("system.planReturnSolar")}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const system = findSystem(previewId);
  if (!system) return null;

  const sysName = getLocalizedName(system.id, locale);
  const facts = localizeFacts(system.facts, locale);
  const currentLabel =
    activeSystem === "solar"
      ? t("system.currentSolar")
      : t("system.anotherSystem");

  return (
    <div className="info-panel system-card open">
      {!atDestination && (
        <button
          className="close"
          onClick={() => selectSystem(null)}
          aria-label={t("close")}
        >
          ×
        </button>
      )}
      <span className="tag">{system.tagline}</span>
      <h2>{sysName}</h2>
      {showEn && <div className="en">{system.nameEn}</div>}
      <p className="desc">{system.description}</p>
      <div className="facts">
        {facts.map((f) => (
          <div className="fact" key={f.k}>
            <div className="k">{f.k}</div>
            <div className="v">{f.v}</div>
          </div>
        ))}
      </div>

      <div className="orbit-actions">
        {!atDestination ? (
          <>
            <button
              className="orbit-btn"
              disabled={warping}
              onClick={() => startWarp(system.id)}
            >
              {t("system.warpTo", { name: sysName })}
            </button>
            <p className="orbit-hint">
              {t("system.warpHintExo", { current: currentLabel })}
            </p>
          </>
        ) : (
          <>
            <p className="orbit-hint">{t("system.atDestinationExo")}</p>
            <button
              className="orbit-btn ghost"
              disabled={warping}
              onClick={() => selectSystem("solar")}
            >
              {t("system.planReturnSolar")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
