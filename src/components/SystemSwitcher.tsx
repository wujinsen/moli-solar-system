import { useState } from "react";
import { useStore } from "../store/useStore";
import { SYSTEM_MENU, findSystem } from "../data/systems";
import { BLACKHOLE_MENU, findBlackHole } from "../data/blackholes";
import {
  getBlackHoleCategoryLabel,
  getLocalizedName,
  getSystemMenuName,
  localizeBlackHoleMenu,
  localizeSystemMenu,
  useT,
} from "../i18n";

function systemNameEn(id: string, zhName: string): string {
  if (id === "solar") return "Solar System";
  return findSystem(id)?.nameEn ?? zhName;
}

export function SystemSwitcher() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const [open, setOpen] = useState(false);
  const activeSystem = useStore((s) => s.activeSystem);
  const targetSystem = useStore((s) => s.targetSystem);
  const selectSystem = useStore((s) => s.selectSystem);
  const activeBlackHole = BLACKHOLE_MENU.find((b) => b.id === activeSystem);
  const currentMenu =
    SYSTEM_MENU.find((s) => s.id === activeSystem) ?? SYSTEM_MENU[0];
  const currentName = activeBlackHole
    ? getLocalizedName(activeBlackHole.id, locale)
    : getSystemMenuName(
        currentMenu.id,
        currentMenu.name,
        systemNameEn(currentMenu.id, currentMenu.name),
        locale
      );

  const handlePick = (id: string) => {
    if (id === "solar") {
      if (activeSystem === "solar") selectSystem(null);
      else selectSystem("solar");
    } else {
      selectSystem(id);
    }
    setOpen(false);
  };

  return (
    <div className={`system-switcher ${open ? "open" : ""}`}>
      <button className="sys-current" onClick={() => setOpen((v) => !v)}>
        <div className="sys-label">
          <span className="sys-eyebrow">{t("system.eyebrow")}</span>
          <span className="sys-name">{currentName}</span>
        </div>
        <span className="sys-caret">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="sys-menu">
          <div className="sys-group-label">{t("system.starSystems")}</div>
          {SYSTEM_MENU.map((s) => {
            const loc = localizeSystemMenu(s.id, locale, {
              starType: s.starType,
              distanceLy: s.distanceLy,
              tagline: s.tagline,
            });
            return (
              <button
                key={s.id}
                className={`sys-item ${
                  s.id === activeSystem ? "active" : ""
                } ${s.id === targetSystem && s.id !== activeSystem ? "preview" : ""}`}
                onClick={() => handlePick(s.id)}
              >
                <div className="sys-item-head">
                  <span className="sys-item-name">
                    {getSystemMenuName(
                      s.id,
                      s.name,
                      systemNameEn(s.id, s.name),
                      locale
                    )}
                  </span>
                  <span className="sys-item-count">
                    {s.planetCount} {t("system.planets")}
                  </span>
                </div>
                <div className="sys-item-sub">
                  {loc.starType} · {loc.distanceLy}
                </div>
                <div className="sys-item-tag">{loc.tagline}</div>
              </button>
            );
          })}

          <div className="sys-group-label">{t("system.blackHoles")}</div>
          {BLACKHOLE_MENU.map((b) => {
            const bh = findBlackHole(b.id);
            const loc = localizeBlackHoleMenu(b.id, locale, {
              distanceLy: b.distanceLy,
              mass: b.mass,
              tagline: b.tagline,
            });
            return (
              <button
                key={b.id}
                className={`sys-item bh-item ${
                  b.id === activeSystem ? "active" : ""
                } ${b.id === targetSystem && b.id !== activeSystem ? "preview" : ""}`}
                onClick={() => handlePick(b.id)}
              >
                <div className="sys-item-head">
                  <span className="sys-item-name">
                    {getLocalizedName(b.id, locale)}
                  </span>
                  <span className="sys-item-count bh-mass">{loc.mass}</span>
                </div>
                <div className="sys-item-sub">
                  {getBlackHoleCategoryLabel(
                    bh?.category ?? "stellar",
                    b.categoryLabel,
                    locale
                  )}{" "}
                  · {loc.distanceLy}
                </div>
                <div className="sys-item-tag">{loc.tagline}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
