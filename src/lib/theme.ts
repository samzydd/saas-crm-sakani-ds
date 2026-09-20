/**
 * The app's one and only theme store.
 *
 * There are two things that can change this app's theme: the header toggle
 * (a click) and the docs site driving it through an <iframe> via postMessage
 * (see useEmbeddedThemeControl). Those used to be two separate
 * implementations that each flipped `.dark` on <html> by hand, which caused
 * two separate bugs:
 *
 * 1. Only one of them suppressed transitions around the class change, so an
 *    embedded theme flip still set off every component's own hover/focus
 *    transition at its own duration -- the "some parts respond late" symptom.
 * 2. Nothing connected an embedded flip back to React. The toggle's own
 *    `checked` lived in component state, so a postMessage changed the page's
 *    colors while the switch, its sun/moon icons and its aria-label all
 *    stayed frozen in the previous theme -- visibly the single most obvious
 *    "component that didn't react", and unreachable by any amount of CSS.
 *
 * Both follow from having had two sources of truth, so there is now one.
 * Everything that changes the theme calls setTheme; everything that displays
 * it subscribes. Adding a third trigger later means calling setTheme, not
 * writing a third copy of this.
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
/** Matches the `.theme-swap` kill-switch rule in vendor-sakani-tokens.css. */
const SUPPRESS_CLASS = 'theme-swap';

/**
 * Seeded from the DOM rather than from localStorage/matchMedia: the inline
 * script in index.html has already resolved those two into an actual class on
 * <html> before this module loads, specifically to avoid a flash of the wrong
 * theme. Reading the result of that instead of re-deriving it keeps one
 * resolution rule in one place, and can't throw the way a storage read can in
 * a cross-origin iframe.
 */
let current: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const listeners = new Set<() => void>();

export function getTheme(): Theme {
  return current;
}

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function setTheme(next: Theme): void {
  if (next === current) return;
  current = next;

  const root = document.documentElement;
  root.classList.add(SUPPRESS_CLASS);
  // Forces the "all transitions off" state to be applied before the line
  // below, rather than being batched into one style recalculation with it --
  // without this read the suppression would never actually take effect first.
  void root.offsetHeight;

  root.classList.toggle('dark', next === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Embedded cross-origin, storage may be partitioned off. Persistence is
    // the only thing lost; the theme itself still applies.
  }

  // Transitions only need to be off WHILE the new colors land, not after.
  // The timeout backs up rAF in a backgrounded tab (deferred there), so
  // suppression can't stick and silently kill every later hover transition.
  const release = () => root.classList.remove(SUPPRESS_CLASS);
  requestAnimationFrame(release);
  setTimeout(release, 100);

  listeners.forEach((notify) => notify());
}
