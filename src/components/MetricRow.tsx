import type { ReactNode } from 'react';
import styles from './MetricRow.module.css';

interface MetricRowProps {
  icon?: ReactNode;
  label: string;
  value: string;
  /** 0-100 — width of the bg/subtle fill behind the icon+label, relative to
   * this row's own value vs. the largest value in its group (Figma "List
   * Item" -> "Progress": a fill bar sized to the metric, icon+label inside
   * it, value text outside to the right). Omit for no fill. */
  fillPercent?: number;
  /** Figma "Top customers": value text uses fg/subtle instead of the
   * default fg/default, unlike every other MetricRow usage. */
  valueMuted?: boolean;
  className?: string;
}

/** Local list row for label + right-aligned value (Figma "List Item" ->
 * "Progress" pattern used for funnels, top-N lists, and simple breakdowns). */
export function MetricRow({ icon, label, value, fillPercent, valueMuted, className }: MetricRowProps) {
  return (
    <div className={[styles.row, className ?? ''].filter(Boolean).join(' ')}>
      {fillPercent != null && <span className={styles.fill} style={{ width: `${fillPercent}%` }} aria-hidden="true" />}
      <span className={styles.left}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </span>
      <span className={[styles.value, valueMuted ? styles['value--muted'] : ''].filter(Boolean).join(' ')}>{value}</span>
    </div>
  );
}
