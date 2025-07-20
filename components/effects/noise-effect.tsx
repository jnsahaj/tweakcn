export function NoiseEffect() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 opacity-[8%]"
      width="100%"
      height="100%"
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.70"
          numOctaves="4"
          stitchTiles="stitch"
        ></feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"></rect>
    </svg>
  );
}
