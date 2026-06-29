import { Stars } from "@react-three/drei";

export function Starfield() {
  return (
    <Stars
      radius={400}
      depth={120}
      count={9000}
      factor={6}
      saturation={0}
      fade
      speed={0.4}
    />
  );
}
