import type { ResolvedSelection } from "../data/bodies";
import { resolveSelection, findBody, findMoon } from "../data/bodies";
import { findComet } from "../data/comets";
import { findStation } from "../data/station";
import { findBlackHole } from "../data/blackholes";
import { findSystem } from "../data/systems";
import type { Locale } from "./types";
import { t, tf } from "./ui";
import { getEntityOverlay, TAG_TO_CATEGORY } from "./entities";

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

export function localizeSelection(
  base: ResolvedSelection,
  locale: Locale
): ResolvedSelection {
  if (locale === "zh") return base;

  const overlay = getEntityOverlay(base.id, locale);
  const displayName =
    overlay?.name ?? (locale === "en" ? base.nameEn : base.name);

  const parentId = base.isMoon ? findMoon(base.id)?.parent.id : undefined;

  return {
    ...base,
    name: displayName,
    tag: overlay?.tag ?? localizeTag(base.tag, locale),
    description: overlay?.description ?? base.description,
    parentName: parentId ? getLocalizedName(parentId, locale) : base.parentName,
    facts: base.facts.map((f) => ({
      k: localizeFactKey(f.k, locale),
      v: f.v,
    })),
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
