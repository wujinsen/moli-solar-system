import { useT } from "../i18n";

export function Loader() {
  const t = useT();
  return (
    <div className="loader">
      <div className="ring" />
      <div className="txt">{t("loader")}</div>
    </div>
  );
}
