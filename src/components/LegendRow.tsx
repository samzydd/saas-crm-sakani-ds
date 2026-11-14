import styles from './LegendRow.module.css';

interface LegendRowProps {
  /** 1-6: indexes into the shared --color-chart-N tokens, in the same order as the chart's segments. */
  colorIndex: number;
  label: string;
  value: string;
}

/** A chart legend row: the segment's colour, its name, and its share. */
export function LegendRow({ colorIndex, label, value }: LegendRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.swatch} style={{ background: `var(--color-chart-${colorIndex})` }} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
