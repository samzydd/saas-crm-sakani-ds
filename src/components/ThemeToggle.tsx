import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@sakaniui/react';
import { getTheme, setTheme, subscribeTheme } from '../lib/theme';
import styles from './ThemeToggle.module.css';

/**
 * Flips the app between light and dark by way of the shared theme store (see
 * lib/theme.ts), which owns both the `.dark` class on <html> and the
 * transition-suppression window around changing it.
 *
 * Reading through useSyncExternalStore rather than useState is what keeps
 * this control honest when something OTHER than a click changes the theme --
 * the docs site drives this app's theme by postMessage while it's embedded,
 * and with the theme held in local component state the switch, icons and
 * aria-label all stayed stuck in the old theme while the page around them
 * changed. Subscribing means the display follows the theme no matter who
 * changed it.
 *
 * On the suppression itself: `.theme-swap` is a blanket
 * `transition: none !important` kill switch held for exactly the duration of
 * the class flip. Component transitions can't tell "the user is hovering me"
 * from "a color token changed underneath me because the theme swapped", and
 * they fire for both -- each at its own duration, which is what reads as the
 * dashboard changing theme in pieces instead of at once. Suppressing for that
 * one instant leaves every component's own hover/focus transition fully
 * intact while giving it nothing to animate at the moment it would otherwise
 * fire for the wrong reason.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme);

  return (
    // theme-toggle-live is a plain, un-hashed global class (unlike
    // styles.root, which CSS Modules hashes) -- vendor-sakani-tokens.css needs
    // a stable name to carve this subtree out of the suppression rule, so the
    // switch's own thumb-slide still animates on the click that caused it.
    <span className={`${styles.root} theme-toggle-live`}>
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
