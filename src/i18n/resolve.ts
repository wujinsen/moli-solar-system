import type { ResolvedSelection } from "../data/bodies";
import { resolveSelection, findBody, findMoon } from "../data/bodies";
import { findComet } from "../data/comets";
import { findStation } from "../data/station";
import { findBlackHole } from "../data/blackholes";
import { findSystem } from "../data/systems";
import type { Locale, LocalizedFact } from "./types";
import { t, tf } from "./ui";
import { getEntityOverlay, TAG_TO_CATEGORY } from "./entities";
import { getPanelOverlay } from "./panels";
import { localizeFactValue } from "./factValues";

export function getLocalizedName(id: string, locale: Locale): string {
  const overlay = getEntityOverlay(id, locale);
  if (overlay?.name) return overlay.name;

  const body = findBody(id);
  if (body) return locale === "en" ? body.nameEn : body.name;

  const moon = findMoon(id);
  if (moon) return locale === "en" ? moon.moon.nameEn : moon.moon.name;

  const comet = findComet(id);
  if (comet) return locale === "en" ? comet.nameEn : comet.name;

  const station = findStation(id);
  if (station) return locale === "en" ? station.nameEn : station.name;

  const bh = findBlackHole(id);
  if (bh) return locale === "en" ? bh.nameEn : bh.name;

  const sys = findSystem(id);
  if (sys) return locale === "en" ? sys.nameEn : sys.name;

  if (id === "ship") {
    return locale === "en" ? "Autumn Wind" : locale === "ja" ? "秋風之敦号" : "秋风之敦号";
  }

  return id;
}

function localizeTag(zhTag: string, locale: Locale): string {
  if (locale === "zh") return zhTag;
  const key = TAG_TO_CATEGORY[zhTag];
  if (key) return t(locale, `category.${key}`);
  return zhTag;
}

function localizeFactKey(k: string, locale: Locale): string {
  if (locale === "zh") return k;
  return tf(locale, k) || k;
}

export function localizeFactsArray(
  facts: LocalizedFact[],
  locale: Locale
): LocalizedFact[] {
  if (locale === "zh") return facts;
  return facts.map((f) => ({
    k: localizeFactKey(f.k, locale),
    v: localizeFactValue(f.v, locale),
  }));
}

function moonFallbackDescription(
  parentId: string | undefined,
  locale: Locale
): string {
  const parent = parentId ? getLocalizedName(parentId, locale) : "";
  if (locale === "en") return `Natural satellite of ${parent}.`;
  if (locale === "ja") return `${parent}の天然衛星。`;
  return "";
}

export function getLocalizedPanelContent(
  id: string,
  locale: Locale,
  zh: { description: string; tagline?: string; facts: LocalizedFact[] }
): { description: string; tagline?: string; facts: LocalizedFact[] } {
  if (locale === "zh") return zh;

  const panel = getPanelOverlay(id, locale);
  const entity = getEntityOverlay(id, locale);

  return {
    description: panel?.description ?? entity?.description ?? zh.description,
    tagline: panel?.tagline ?? zh.tagline,
    facts:
      panel?.facts ??
      entity?.facts ??
      localizeFactsArray(zh.facts, locale),
  };
}

export function localizeSelection(
  base: ResolvedSelection,
  locale: Locale
): ResolvedSelection {
  if (locale === "zh") return base;

  const panel = getPanelOverlay(base.id, locale);
  const entity = getEntityOverlay(base.id, locale);
  const parentId = base.isMoon ? findMoon(base.id)?.parent.id : undefined;

  const displayName =
    entity?.name ?? (locale === "en" ? base.nameEn : base.name);

  let description =
    panel?.description ??
    entity?.description ??
    base.description;

  if (
    base.isMoon &&
    !panel?.description &&
    !entity?.description &&
    description.includes("的天然卫星")
  ) {
    description = moonFallbackDescription(parentId, locale);
  }

  const facts =
    panel?.facts ??
    entity?.facts ??
    localizeFactsArray(
      base.facts.map((f) =>
        f.k === "母星" && parentId
          ? { ...f, v: getLocalizedName(parentId, locale) }
          : f
      ),
      locale
    );

  return {
    ...base,
    name: displayName,
    tag: entity?.tag ?? localizeTag(base.tag, locale),
    description,
    parentName: parentId ? getLocalizedName(parentId, locale) : base.parentName,
    facts,
  };
}

export function resolveLocalizedSelection(
  id: string | null,
  locale: Locale
): ResolvedSelection | undefined {
  const base = resolveSelection(id);
  if (!base) return undefined;
  return localizeSelection(base, locale);
}

export function getSystemMenuName(
  id: string,
  zhName: string,
  nameEn: string,
  locale: Locale
): string {
  if (locale === "en") return nameEn;
  if (locale === "ja") {
    if (id === "solar") return "太陽系";
    const sys = findSystem(id);
    if (sys) return sys.name;
  }
  return zhName;
}

export function getBlackHoleCategoryLabel(
  category: string,
  categoryLabel: string,
  locale: Locale
): string {
  if (locale === "zh") return categoryLabel;
  return t(locale, `category.${category}`);
}
