export type Locale = "zh" | "en" | "ja";

export const LOCALES: Locale[] = ["zh", "en", "ja"];

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中",
  en: "EN",
  ja: "日",
};

export interface LocalizedFact {
  k: string;
  v: string;
}

export interface EntityOverlay {
  name?: string;
  nameEn?: string;
  tag?: string;
  description?: string;
  tagline?: string;
  categoryLabel?: string;
  facts?: LocalizedFact[];
}
