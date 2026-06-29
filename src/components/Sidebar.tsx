import { useState } from "react";
import { useStore } from "../store/useStore";
import { SUN, PLANETS } from "../data/bodies";
import { HALLEY } from "../data/comets";
import { SPACE_STATION } from "../data/station";
import { EXO_SYSTEMS, findSystem } from "../data/systems";
import { BLACK_HOLES, findBlackHole } from "../data/blackholes";
import {
  getBlackHoleCategoryLabel,
  getEntityOverlay,
  getLocalizedName,
  useLocale,
  useT,
} from "../i18n";
import type { Locale } from "../i18n/types";

interface CatalogItem {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  description: string;
  ship?: boolean;
  station?: boolean;
  blackhole?: boolean;
  exoSystem?: boolean;
  active?: boolean;
  onClick: () => void;
}

interface Section {
  id: string;
  label: string;
  items: CatalogItem[];
  defaultOpen?: boolean;
}

function bodyBrief(id: string, zhDesc: string, locale: Locale): string {
  return getEntityOverlay(id, locale)?.description ?? zhDesc;
}

function buildExoSystemItems(
  activeSystem: string,
  locale: Locale,
  selectSystem: (id: string | null) => void
): CatalogItem[] {
  return EXO_SYSTEMS.map((sys) => ({
    id: sys.id,
    name: getLocalizedName(sys.id, locale),
    nameEn: sys.nameEn,
    color: sys.star.color,
    description: `${sys.tagline} · ${sys.distanceLy}`,
    exoSystem: true,
    active: activeSystem === sys.id,
    onClick: () => selectSystem(sys.id),
  }));
}

function buildBlackHoleItems(
  activeSystem: string,
  locale: Locale,
  selectSystem: (id: string | null) => void,
  select: (id: string | null) => void
): CatalogItem[] {
  return BLACK_HOLES.map((bh) => ({
    id: bh.id,
    name: getLocalizedName(bh.id, locale),
    nameEn: bh.nameEn,
    color: bh.visual.colorHot,
    description: `${getBlackHoleCategoryLabel(bh.category, bh.categoryLabel, locale)} · ${bh.mass}`,
    blackhole: true,
    active: activeSystem === bh.id,
    onClick: () => {
      if (activeSystem === bh.id) select(bh.id);
      else selectSystem(bh.id);
    },
  }));
}

export function Sidebar() {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const activeSystem = useStore((s) => s.activeSystem);
  const selectedId = useStore((s) => s.selectedId);
  const shipTarget = useStore((s) => s.shipTarget);
  const shipDest = useStore((s) => s.shipDest);
  const select = useStore((s) => s.select);
  const selectSystem = useStore((s) => s.selectSystem);
  const exo = findSystem(activeSystem);
  const blackHole = findBlackHole(activeSystem);
  const inSolar = activeSystem === "solar";
  const showEn = locale === "zh";

  const shipStatus = shipDest
    ? t("sidebar.shipCruising", { target: getLocalizedName(shipDest, locale) })
    : t("sidebar.shipOrbiting", {
        target: getLocalizedName(shipTarget, locale),
      });

  const goSolar = (bodyId: string) => {
    if (inSolar) select(bodyId);
    else selectSystem("solar");
  };

  const exoSystemItems = buildExoSystemItems(activeSystem, locale, selectSystem);
  const blackHoleItems = buildBlackHoleItems(
    activeSystem,
    locale,
    selectSystem,
    select
  );

  const sections: Section[] = [];

  if (exo) {
    sections.push({
      id: "current-exo",
      label: t("sidebar.exoBodies", { name: getLocalizedName(exo.id, locale) }),
      items: [
        {
          id: exo.star.id,
          name: getLocalizedName(exo.star.id, locale),
          nameEn: exo.star.nameEn,
          color: exo.star.color,
          description: exo.star.description,
          onClick: () => select(exo.star.id),
        },
        ...exo.planets.map((p) => ({
          id: p.id,
          name: getLocalizedName(p.id, locale),
          nameEn: p.nameEn,
          color: p.baseColor,
          description: p.description,
          onClick: () => select(p.id),
        })),
      ],
      defaultOpen: true,
    });
  }

  sections.push({
    id: "bodies",
    label: t("sidebar.solarBodies"),
    items: [SUN, ...PLANETS].map((b) => ({
      id: b.id,
      name: getLocalizedName(b.id, locale),
      nameEn: b.nameEn,
      color: b.baseColor,
      description: bodyBrief(b.id, b.description, locale),
      onClick: () => goSolar(b.id),
    })),
    defaultOpen: inSolar,
  });

  sections.push({
    id: "ship",
    label: t("sidebar.ship"),
    items: [
      {
        id: "ship",
        name: t("ship.name"),
        nameEn: "Autumn Wind",
        color: "#5fd4ff",
        description: shipStatus,
        ship: true,
        onClick: () => goSolar("ship"),
      },
    ],
    defaultOpen: inSolar,
  });

  sections.push({
    id: "station",
    label: t("sidebar.station"),
    items: [
      {
        id: SPACE_STATION.id,
        name: getLocalizedName(SPACE_STATION.id, locale),
        nameEn: SPACE_STATION.nameEn,
        color: SPACE_STATION.color,
        description: t("sidebar.stationDesc"),
        station: true,
        onClick: () => goSolar(SPACE_STATION.id),
      },
    ],
    defaultOpen: inSolar,
  });

  sections.push({
    id: "comet",
    label: t("sidebar.comet"),
    items: [
      {
        id: HALLEY.id,
        name: getLocalizedName(HALLEY.id, locale),
        nameEn: HALLEY.nameEn,
        color: HALLEY.color,
        description: bodyBrief(HALLEY.id, HALLEY.description, locale),
        onClick: () => goSolar(HALLEY.id),
      },
    ],
    defaultOpen: inSolar,
  });

  sections.push({
    id: "exosystems",
    label: t("sidebar.exoSystems"),
    items: exoSystemItems,
    defaultOpen: !!exo,
  });

  sections.push({
    id: "blackholes",
    label: t("sidebar.blackHoles"),
    items: blackHoleItems,
    defaultOpen: !!blackHole,
  });

  function sectionOpen(sec: Section): boolean {
    return openSections[sec.id] ?? sec.defaultOpen ?? false;
  }

  function toggleSection(sec: Section) {
    setOpenSections((prev) => ({ ...prev, [sec.id]: !sectionOpen(sec) }));
  }

  function renderItem(b: CatalogItem) {
    const isActive = b.active || selectedId === b.id;
    return (
      <li key={b.id} className={isActive ? "active" : ""} onClick={b.onClick}>
        <span
          className={
            b.ship
              ? "dot ship-dot"
              : b.station
              ? "dot station-dot"
              : b.blackhole
              ? "dot bh-dot"
              : b.exoSystem
              ? "dot exo-dot"
              : "dot"
          }
          style={
            b.ship || b.station || b.exoSystem
              ? b.exoSystem
                ? { background: b.color, boxShadow: `0 0 10px ${b.color}` }
                : undefined
              : b.blackhole
              ? { background: "#000", boxShadow: `0 0 10px ${b.color}` }
              : { background: b.color }
          }
        />
        <div className="meta">
          <div className="nm">{b.name}</div>
          {showEn && <div className="en">{b.nameEn}</div>}
          {b.ship ? (
            <div className="brief ship-brief">
              <span className="ship-role">{t("sidebar.shipCaptain")}</span>
              <span className="ship-sep">·</span>
              <span className="ship-loc">{b.description}</span>
            </div>
          ) : (
            <div className="brief">{b.description}</div>
          )}
        </div>
      </li>
    );
  }

  return (
    <>
      <button
        className={`sidebar-toggle ${open ? "hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-label={t("sidebar.toggle")}
      >
        ☰ {t("sidebar.title")}
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <span>{t("sidebar.title")}</span>
          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label={t("sidebar.collapse")}
          >
            ×
          </button>
        </div>

        <div className="sidebar-body">
          {sections.map((sec) => {
            const isOpen = sectionOpen(sec);
            return (
              <div className="sidebar-group" key={sec.id}>
                <button
                  className={`sidebar-section toggle ${isOpen ? "open" : ""}`}
                  onClick={() => toggleSection(sec)}
                >
                  <span className="sec-caret">{isOpen ? "▾" : "▸"}</span>
                  <span className="sec-label">{sec.label}</span>
                  <span className="sec-count">{sec.items.length}</span>
                </button>
                {isOpen && (
                  <ul className="sidebar-list">{sec.items.map(renderItem)}</ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="sidebar-foot">{t("sidebar.foot")}</div>
      </aside>
    </>
  );
}
