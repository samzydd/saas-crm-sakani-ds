import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@sakaniui/react';
import styles from './ThemeToggle.module.css';

const STORAGE_KEY = 'theme';

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Flips the app between light and dark mode by toggling `.dark` on <html> —
 * @sakaniui/react's semantic color tokens re-theme automatically once that
 * class is present.
 *
 * The class flip is wrapped in the View Transitions API rather than relying
 * on a CSS `transition` declared on every element, which is what
 * index.css used to do (a `*, *::before, *::after` rule transitioning
 * background-color/color/border-color/box-shadow). Measured directly via
 * document.getAnimations() right after a click on the live dashboard: that
 * rule started 667 simultaneous per-element transitions from one toggle —
 * color alone was animating on 516 of the page's 578 DOM nodes at once.
 * That many concurrent repaints competing for a single main-thread frame
 * budget is what produced the dropped-frame, blurred grey-wash flash
 * visible on click.
 *
 * startViewTransition reaches the same design goal — a uniform change
 * rather than some things fading while others snap — through one
 * compositor operation instead: it snapshots the page once before the class
 * change and once after, then crossfades those two textures as a single
 * operation, so the cost doesn't scale with how many DOM nodes exist.
 * Falls back to an instant, un-animated swap where it isn't supported
 * (older Safari) — which is what every element does now regardless, since
 * the mass CSS transition rule is gone.
 *
 * The very first application (on mount) is skipped deliberately:
 * index.html already applies the stored/preferred theme before React even
 * runs, specifically to avoid a flash on load, so this run is a redundant
 * re-application of a class that's already there — wrapping it in a
 * transition would crossfade a page that never visually changed.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);
    };

    if (isFirstRun.current) {
      isFirstRun.current = false;
      apply();
      return;
    }

    if (document.startViewTransition) {
      // A ViewTransition exposes three SEPARATE promises --
      // updateCallbackDone, ready, and finished -- and a skipped/interrupted
      // transition (the switch clicked again before the crossfade finishes,
      // or the page navigating away mid-transition) rejects all three
      // independently. Catching only one still leaves the other two
      // reporting as unhandled -- confirmed directly: catching just
      // `finished` did not stop the console errors from a rapid
      // double-click, because `ready` and `updateCallbackDone` were still
      // uncaught. All three need a no-op catch.
      const transition = document.startViewTransition(apply);
      transition.updateCallbackDone.catch(() => {});
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    } else {
      apply();
    }
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
