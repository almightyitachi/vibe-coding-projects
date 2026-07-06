import type { Priority, TaskStatus } from "@/lib/types";
import { PRIORITY_META, STATUS_META } from "@/lib/domain";

/** Linear-style circular status indicator. */
export function StatusIcon({ status, size = 14 }: { status: TaskStatus; size?: number }) {
  const meta = STATUS_META[status];
  const c = meta.dot;
  if (status === "DONE" || status === "APPROVED") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-label={meta.label}>
        <circle cx="7" cy="7" r="6.5" fill={c} />
        <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "BACKLOG") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-label={meta.label}>
        <circle cx="7" cy="7" r="6" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    );
  }
  const pct = status === "TODO" ? 0 : status === "IN_PROGRESS" ? 50 : 80;
  const r = 5.5;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-label={meta.label}>
      <circle cx="7" cy="7" r={r} fill="none" stroke={c} strokeWidth="1.5" opacity="0.35" />
      {pct > 0 && (
        <circle
          cx="7" cy="7" r={r} fill="none" stroke={c} strokeWidth="3"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
          transform="rotate(-90 7 7)" strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/** Priority bars, Linear-style. */
export function PriorityIcon({ priority, size = 14 }: { priority: Priority; size?: number }) {
  const meta = PRIORITY_META[priority];
  if (priority === "URGENT") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-label="Urgent">
        <rect x="1" y="1" width="12" height="12" rx="3" fill={meta.color} />
        <rect x="6.25" y="3" width="1.5" height="5" rx="0.75" fill="#fff" />
        <rect x="6.25" y="9.5" width="1.5" height="1.5" rx="0.75" fill="#fff" />
      </svg>
    );
  }
  const levels: Record<Priority, number> = { URGENT: 3, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const active = levels[priority];
  const heights = [4, 7, 10];
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-label={meta.label}>
      {heights.map((h, i) => (
        <rect key={i} x={2 + i * 4} y={12 - h} width="2.5" height={h} rx="1"
          fill={i < active ? meta.color : "currentColor"} opacity={i < active ? 1 : 0.22} />
      ))}
    </svg>
  );
}
