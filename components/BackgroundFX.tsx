import ReactiveGalaxy from "./ReactiveGalaxy";

// Layer order (back → front): void vignette → reactive galaxy → nebula orbs → noise.
export default function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="vignette absolute inset-0" />
      <ReactiveGalaxy />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div className="orb orb-d" />
      <div className="noise absolute inset-0" />
    </div>
  );
}