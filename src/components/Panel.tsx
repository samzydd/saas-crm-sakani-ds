import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Local composition of the Figma "Page Header" (title + description) atop a
 * bordered card — the design system ships the pieces (Badge, Button) but not
 * this specific card shell, so it's assembled here and reused across pages. */
export function Panel({ title, description, actions, children, className }: PanelProps) {
  return (
    <div className={[styles.panel, className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
      {children}
    </div>
  );
}
