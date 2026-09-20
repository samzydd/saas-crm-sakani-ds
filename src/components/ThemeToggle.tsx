import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@sakaniui/react';
import styles from './ThemeToggle.module.css';

const STORAGE_KEY = 'theme';
/** Matches the `.theme-swap` kill-switch rule in vendor-sakani-tokens.css. */
const SUPPRESS_CLASS = 'theme-swap';

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
 * Three things were tried here, in order, each one disproving the last by
 * direct measurement rather than by eye:
 *
 * 1. A `*, *::before, *::after` rule transitioning background-color/color/
 *    border-color/box-shadow on every element. Measured via
 *    document.getAnimations() right after a click on the live dashboard:
 *    667 simultaneous per-element transitions from one toggle, color alone
 *    animating on 516 of the page's 578 nodes at once. That many concurrent
 *    repaints competing for one main-thread frame budget produced a
 *    dropped-frame, blurred grey-wash flash.
 *
 * 2. The View Transitions API, on the theory that one compositor-level
 *    crossfade would be cheap regardless of page density. It is cheap, but
 *    a root-level crossfade blends a single before/after SCREENSHOT, and
 *    third-party component trees not authored with view transitions in
 *    mind (charts, dropdowns) are exactly where that desyncs from the rest
 *    of the page's snapshot -- reported back as "some things transition and
 *    some don't."
 *
 * 3. Removing page-content animation entirely and letting the class flip be
 *    a plain instant toggle. This looked right -- until measuring again
 *    turned up 30 transitions still firing, at TWO different durations
 *    (150ms and 220ms) simultaneously. Individual components (buttons,
 *    badges, cards) each declare their OWN transition for hover/focus, and
 *    a CSS transition fires on any value change to that property -- it has
 *    no way to distinguish "the user is hovering" from "a color token
 *    changed underneath me because the theme swapped." Different
 *    components' own hover durations therefore finished at genuinely
 *    different times: the same "not synchronized" symptom, just at a
 *    smaller scale than attempt 1.
 *
 * The fix attempts 1 and 2 both missed: you cannot referee the independent
 * timing of components you don't control without touching every one of
 * them. What you CAN do is make sure none of their transition rules ever
 * fire in the first place for THIS specific state change. `.theme-swap`
 * (see vendor-sakani-tokens.css) is a blanket `transition: none !important`
 * kill switch, added to <html> for exactly the duration of the class flip
 * and removed right after -- so every component's own transition, untouched
 * and still fully intact for real hover/focus, simply has nothing to
 * animate at the one moment it would otherwise fire for the wrong reason.
 *
 * The Switch below is deliberately carved out of that kill switch (see the
 * `.theme-toggle-live` exclusion in vendor-sakani-tokens.css). A `transition`
 * rule is a single property that replaces its whole value wholesale, not a
 * per-property merge -- so blanket-suppressing every descendant of <html>,
 * with no exception, would have ALSO overridden the Switch's own thumb-slide
 * transition for the one click that's actually supposed to show it. That
 * regression was real, not hypothetical: confirmed by tracing the cascade,
 * this exclusion is what makes the toggle itself the one thing that still
 * visibly animates in response to its own click.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      // index.html already applied the stored/preferred theme before React
      // ran, specifically to avoid a flash on load -- this run is a
      // redundant re-application of a class that's already there, so it
      // doesn't need the suppression dance below (nothing is transitioning
      // on a page that hasn't painted its first frame yet anyway).
      isFirstRun.current = false;
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);
      return;
    }

    const root = document.documentElement;
    root.classList.add(SUPPRESS_CLASS);
    // Forces the browser to apply the "all transitions off" state before the
    // next line runs, rather than batching it together with the .dark
    // change -- without this read, both class changes could be coalesced
    // into one style recalculation and the suppression would never actually
    // take effect first.
    void root.offsetHeight;

    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);

    // Re-enable on the next frame: transitions only need to be off WHILE the
    // new colors are being applied, not after. requestAnimationFrame runs
    // after this paint; a timeout backs it up in case the tab is
    // backgrounded and rAF is deferred, so the suppression can't get stuck
    // on and silently kill every future hover transition.
    const raf = requestAnimationFrame(() => root.classList.remove(SUPPRESS_CLASS));
    const timer = setTimeout(() => root.classList.remove(SUPPRESS_CLASS), 100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [theme]);

  return (
    // theme-toggle-live is a plain, un-hashed global class (unlike
    // styles.root, which CSS Modules hashes) -- vendor-sakani-tokens.css
    // needs a stable name it can reference from outside this file to carve
    // this subtree out of the suppression rule below.
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
