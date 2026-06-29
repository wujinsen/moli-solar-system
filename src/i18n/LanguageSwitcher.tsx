import { useStore } from "../store/useStore";
import { LOCALES, LOCALE_LABELS, type Locale } from "./types";

export function LanguageSwitcher() {
  const locale = useStore((s) => s.locale);
  const setLocale = useStore((s) => s.setLocale);

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          className={locale === loc ? "active" : ""}
          onClick={() => setLocale(loc as Locale)}
          aria-pressed={locale === loc}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
