import { useLocalizedName, useT } from "../i18n";

export function BodyLabel({ id }: { id: string }) {
  const name = useLocalizedName(id);
  return <div className="body-label">{name}</div>;
}

export function ShipLabel() {
  const t = useT();
  return <div className="body-label">{t("ship.labelFlying")}</div>;
}

export function StationLabel() {
  const t = useT();
  return <div className="body-label">{t("ship.labelStation")}</div>;
}
