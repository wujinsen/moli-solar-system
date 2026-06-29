import { useStore } from "../store/useStore";
import { ZODIAC, ELEMENT_COLOR } from "../data/zodiac";
import { useLocale, useT } from "../i18n";
import {
  getZodiacElementLabel,
  getZodiacSignField,
  ZODIAC_PANEL_LABELS,
} from "../i18n/zodiac-i18n";

export function ConstellationPanel() {
  const t = useT();
  const locale = useLocale();
  const selected = useStore((s) => s.selectedConstellation);
  const selectConstellation = useStore((s) => s.selectConstellation);
  const sign = ZODIAC.find((z) => z.id === selected);
  const labels = ZODIAC_PANEL_LABELS[locale];

  return (
    <div className={`info-panel zodiac-panel ${sign ? "open" : ""}`}>
      <button
        className="close"
        onClick={() => selectConstellation(null)}
        aria-label={t("close")}
      >
        ×
      </button>
      {sign && (
        <>
          <span
            className="tag"
            style={{
              color: ELEMENT_COLOR[sign.element],
              borderColor: ELEMENT_COLOR[sign.element] + "66",
            }}
          >
            {labels.prefix} · {getZodiacElementLabel(sign.element, locale)}
          </span>
          <h2>
            <span
              className="zsym"
              style={{ color: ELEMENT_COLOR[sign.element] }}
            >
              {sign.symbol}
            </span>
            {getZodiacSignField(sign.id, "name", locale, sign.name)}
          </h2>
          <div className="en">{sign.latin}</div>
          <p className="desc">
            {getZodiacSignField(sign.id, "blurb", locale, sign.blurb)}
          </p>
          <div className="facts">
            <div className="fact">
              <div className="k">{labels.factDate}</div>
              <div className="v">{sign.dates}</div>
            </div>
            <div className="fact">
              <div className="k">{labels.factElement}</div>
              <div className="v">
                {getZodiacElementLabel(sign.element, locale)}
              </div>
            </div>
            <div className="fact">
              <div className="k">{labels.factRulingPlanet}</div>
              <div className="v">
                {getZodiacSignField(
                  sign.id,
                  "rulingPlanet",
                  locale,
                  sign.rulingPlanet
                )}
              </div>
            </div>
            <div className="fact">
              <div className="k">{labels.factBrightestStar}</div>
              <div className="v">
                {getZodiacSignField(
                  sign.id,
                  "brightestStar",
                  locale,
                  sign.brightestStar
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
