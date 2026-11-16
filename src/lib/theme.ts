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
/** Matches the `.theme-swap` kill-switch rule in index.css (the package's tokens.css does not ship one). */
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

/** How long the cross-fade lasts. The same number is in index.css (`::view-transition-*`). */
const FADE_MS = 320;

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished: Promise<unknown> } };

export function setTheme(next: Theme): void {
  if (next === current) return;
  current = next;

  const root = document.documentElement;

  /** The change itself: the class, the saved choice, and everything that displays the theme. */
  const apply = () => {
    root.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Embedded cross-origin, storage may be partitioned off. Persistence is
      // the only thing lost; the theme itself still applies.
    }
    listeners.forEach((notify) => notify());
  };
  const release = () => root.classList.remove(SUPPRESS_CLASS);

  // Every component's own colour transition (about 600 elements here, at two different durations) would otherwise
  // start the moment the tokens change and finish at different times: that is the "twitching". They are switched
  // off for the change; the cross-fade below is the only thing that moves.
  root.classList.add(SUPPRESS_CLASS);
  // Forces the "all transitions off" state to be applied before the change, rather than being batched into one
  // style recalculation with it -- without this read the suppression would never actually take effect first.
  void root.offsetHeight;

  const doc = document as ViewTransitionDocument;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (doc.startViewTransition && !reduced) {
    // The browser photographs the page, the theme changes underneath, and it blends the old picture into the new
    // one in one smooth fade, on the compositor, instead of hundreds of separate repaints. The "new" side of that
    // is the live page, so the suppression has to last until the fade is over, not just for one frame.
    const transition = doc.startViewTransition(apply);
    transition.finished.then(release, release);
    // Backs up `finished` (it can be skipped, or deferred in a backgrounded tab) so the suppression can never stick
    // and silently kill every later hover transition.
    setTimeout(release, FADE_MS + 500);
    return;
  }

  // No View Transitions (or reduced motion): a clean instant switch. Transitions only need to be off WHILE the new
  // colors land, and the timeout backs up rAF, which is deferred in a backgrounded tab.
  apply();
  requestAnimationFrame(release);
  setTimeout(release, 100);
}
