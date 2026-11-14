import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  description?: string;
  /** Sits on the right of the title row (a badge, a period menu, a button); wraps under it when there is no room. */
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** A page card: a title row (title and description on the left, actions on the right) over its content. One shell for
 * every page, so cards line up and read the same. */
export function Panel({ title, description, actions, children, className }: PanelProps) {
  return (
    <section className={[styles.panel, className ?? ''].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <div className={styles.headText}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      {children != null && <div className={styles.body}>{children}</div>}
    </section>
  );
}
