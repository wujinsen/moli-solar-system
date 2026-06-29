export type { Locale, EntityOverlay, LocalizedFact } from "./types";
export { LOCALES, LOCALE_LABELS } from "./types";
export { t, tf, UI } from "./ui";
export { getEntityOverlay, SOLAR_BRIEF, TAG_TO_CATEGORY } from "./entities";
export { localizeSystemMenu, localizeBlackHoleMenu } from "./menu";
export {
  getLocalizedName,
  localizeSelection,
  resolveLocalizedSelection,
  getSystemMenuName,
  getBlackHoleCategoryLabel,
} from "./resolve";
export { LanguageSwitcher } from "./LanguageSwitcher";

import { useStore } from "../store/useStore";
import { t as translate } from "./ui";
import { getLocalizedName as resolveName } from "./resolve";
import type { Locale } from "./types";

export function useLocale(): Locale {
  return useStore((s) => s.locale);
}

export function useT() {
  const locale = useLocale();
  return (key: string, params?: Record<string, string>) =>
    translate(locale, key, params);
}

export function useLocalizedName(id: string): string {
  const locale = useLocale();
  return resolveName(id, locale);
}
