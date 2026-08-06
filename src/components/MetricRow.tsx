import type { ReactNode } from 'react';
import styles from './MetricRow.module.css';

interface MetricRowProps {
  icon?: ReactNode;
  label: string;
  value: string;
  className?: string;
}

/** Local list row for label + right-aligned value (Figma "List Item" ->
 * "Progress" pattern used for funnels, top-N lists, and simple breakdowns). */
export function MetricRow({ icon, label, value, className }: MetricRowProps) {
  return (
    <div className={[styles.row, className ?? ''].filter(Boolean).join(' ')}>
      <span className={styles.left}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
