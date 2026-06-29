import { useStore } from "../store/useStore";
import {
  ZODIAC,
  ELEMENT_LABEL,
  ELEMENT_COLOR,
} from "../data/zodiac";

export function ConstellationPanel() {
  const selected = useStore((s) => s.selectedConstellation);
  const selectConstellation = useStore((s) => s.selectConstellation);
  const sign = ZODIAC.find((z) => z.id === selected);

  return (
    <div className={`info-panel zodiac-panel ${sign ? "open" : ""}`}>
      <button
        className="close"
        onClick={() => selectConstellation(null)}
        aria-label="关闭"
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
            黄道 · {ELEMENT_LABEL[sign.element]}
          </span>
          <h2>
            <span
              className="zsym"
              style={{ color: ELEMENT_COLOR[sign.element] }}
            >
              {sign.symbol}
            </span>
            {sign.name}
          </h2>
          <div className="en">{sign.latin}</div>
          <p className="desc">{sign.blurb}</p>
          <div className="facts">
            <div className="fact">
              <div className="k">日期</div>
              <div className="v">{sign.dates}</div>
            </div>
            <div className="fact">
              <div className="k">属性</div>
              <div className="v">{ELEMENT_LABEL[sign.element]}</div>
            </div>
            <div className="fact">
              <div className="k">守护星</div>
              <div className="v">{sign.rulingPlanet}</div>
            </div>
            <div className="fact">
              <div className="k">主星</div>
              <div className="v">{sign.brightestStar}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
