import type { ReactNode } from 'react';
import styles from './MetricRow.module.css';

interface MetricRowProps {
  icon?: ReactNode;
  label: string;
  value: string;
  /** 0-100: how far along its track the bar runs. Omit for a row with no bar. */
  fillPercent?: number;
  /** The bar's colour: any CSS colour, usually a token such as "var(--color-chart-2)". Defaults to chart 1. */
  color?: string;
  /** A smaller, quieter value (for a secondary figure). */
  valueMuted?: boolean;
  className?: string;
}

/** A label and its value over a thin bar: funnels, top-N lists and breakdowns. The bar is decoration; the value says it. */
export function MetricRow({ icon, label, value, fillPercent, color, valueMuted, className }: MetricRowProps) {
  return (
    <div className={[styles.row, className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <span className={styles.left}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.label}>{label}</span>
        </span>
        <span className={[styles.value, valueMuted ? styles['value--muted'] : ''].filter(Boolean).join(' ')}>{value}</span>
      </div>
      {fillPercent != null && (
        <span className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, fillPercent))}%`, background: color }} />
        </span>
      )}
    </div>
  );
}
