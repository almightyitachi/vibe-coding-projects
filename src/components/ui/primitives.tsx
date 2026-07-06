import Link from "next/link";
import type { ReactNode } from "react";
import { cn, initials } from "@/lib/utils";
import { userById } from "@/lib/mock-data";

/* ---------------- Avatar ---------------- */
export function Avatar({ userId, size = 24 }: { userId?: string; size?: number }) {
  const user = userById(userId);
  const color = user?.avatarColor ?? "#8b8b93";
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ring-1 ring-black/5"
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
      title={user?.name}
    >
      {user ? initials(user.name) : "?"}
    </span>
  );
}

export function AvatarStack({ userIds, size = 22, max = 4 }: { userIds: string[]; size?: number; max?: number }) {
  const shown = userIds.slice(0, max);
  const extra = userIds.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((id, i) => (
        <span key={id} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }} className="ring-2 ring-bg rounded-full">
          <Avatar userId={id} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="ml-[-7px] inline-flex items-center justify-center rounded-full bg-bg-inset text-fg-muted ring-2 ring-bg"
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({
  children, color, subtle = true, className,
}: { children: ReactNode; color?: string; subtle?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
      style={
        color
          ? subtle
            ? { color, background: `color-mix(in srgb, ${color} 12%, transparent)` }
            : { color: "#fff", background: color }
          : { color: "var(--fg-muted)", background: "var(--bg-inset)" }
      }
    >
      {children}
    </span>
  );
}

export function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return <span className="inline-block rounded-full" style={{ width: size, height: size, background: color }} />;
}

/* ---------------- Button ---------------- */
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};
export function Button({ children, variant = "secondary", size = "md", className, onClick, type = "button" }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 focus-ring disabled:opacity-50 select-none active:scale-[0.98]";
  const sizes = { sm: "h-7 px-2.5 text-xs", md: "h-8 px-3 text-sm" };
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover shadow-sm",
    secondary: "bg-bg-elevated text-fg border border-border hover:bg-bg-hover hover:border-border-strong",
    ghost: "text-fg-muted hover:bg-bg-hover hover:text-fg",
    danger: "bg-danger text-white hover:opacity-90",
  };
  return (
    <button type={type} onClick={onClick} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  );
}

export function IconButton({ children, onClick, label, className }: { children: ReactNode; onClick?: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg focus-ring", className)}
    >
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({ children, className, hover }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-bg-elevated",
        hover && "transition-all duration-150 hover:border-border-strong hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------------- Kbd ---------------- */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-bg-inset px-1.5 font-sans text-[11px] font-medium text-fg-muted">
      {children}
    </kbd>
  );
}

/* ---------------- ProgressBar ---------------- */
export function ProgressBar({ value, color = "var(--brand)", className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-bg-inset", className)}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

/* ---------------- Page scaffolding ---------------- */
export function PageHeader({
  title, subtitle, icon, actions, breadcrumb,
}: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode; breadcrumb?: ReactNode }) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-inset text-lg">{icon}</div>}
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-fg-muted">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-fg-subtle">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="hover:text-fg transition-colors">{it.label}</Link>
          ) : (
            <span className="text-fg-muted">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-fg-subtle">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-14 text-center">
      <div className="text-fg-subtle">{icon}</div>
      <p className="text-sm font-medium text-fg">{title}</p>
      {hint && <p className="max-w-xs text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}
