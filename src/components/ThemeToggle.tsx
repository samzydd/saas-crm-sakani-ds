import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@sakaniui/react';
import styles from './ThemeToggle.module.css';

const STORAGE_KEY = 'theme';

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Flips the app between light and dark mode by toggling `.dark` on <html> —
 * @sakaniui/react's semantic color tokens re-theme automatically once
 * that class is present. Uses the design system's own Switch as the control,
 * flanked by Sun/Moon icons for clarity. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <span className={styles.root}>
      <Sun size={16} strokeWidth={1.5} className={theme === 'light' ? styles['icon--active'] : styles.icon} aria-hidden="true" />
      <Switch
        checked={theme === 'dark'}
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      />
      <Moon size={16} strokeWidth={1.5} className={theme === 'dark' ? styles['icon--active'] : styles.icon} aria-hidden="true" />
    </span>
  );
}
