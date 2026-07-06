"use client";

/** Lightweight SVG burndown — ideal vs. actual remaining points over a 10-day sprint. */
export function Burndown({ totalPoints }: { totalPoints: number }) {
  const days = 10;
  const w = 320, h = 140, pad = 24;
  const ideal = Array.from({ length: days + 1 }, (_, i) => totalPoints * (1 - i / days));
  // A plausible actual curve that trails ideal then catches up.
  const actualFactors = [1, 0.98, 0.92, 0.9, 0.78, 0.7, 0.62, 0.5, 0.38, 0.22, 0.1];
  const actual = actualFactors.map((f) => totalPoints * f);

  const x = (i: number) => pad + (i / days) * (w - pad * 2);
  const y = (v: number) => pad + (1 - v / totalPoints) * (h - pad * 2);
  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line(actual)} L ${x(days)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Sprint burndown chart">
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={pad} x2={w - pad} y1={pad + g * (h - pad * 2)} y2={pad + g * (h - pad * 2)} stroke="var(--border)" strokeWidth="1" />
      ))}
      <path d={area} fill="var(--brand)" opacity="0.08" />
      <path d={line(ideal)} fill="none" stroke="var(--fg-subtle)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={line(actual)} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {actual.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--brand)" />
      ))}
      <text x={pad} y={h - 6} fontSize="9" fill="var(--fg-subtle)">Day 1</text>
      <text x={w - pad - 20} y={h - 6} fontSize="9" fill="var(--fg-subtle)">Day 10</text>
    </svg>
  );
}
