import { useEffect } from 'react';

const STORAGE_KEY = 'theme';
const MESSAGE_TYPE = 'sakani-crm:set-theme';
/** Matches the `.theme-swap` kill-switch rule in vendor-sakani-tokens.css --
 *  the same one ThemeToggle.tsx uses for a direct click. */
const SUPPRESS_CLASS = 'theme-swap';

/**
 * Lets a parent window (the docs site embedding this app in an <iframe>)
 * flip this app's theme from the outside — the app itself has no way to
 * know it's embedded, and the parent is a different origin so it can't
 * reach into this document's classList/localStorage directly. A
 * postMessage listener is the one channel two different origins actually
 * share.
 *
 * Applies theme exactly the way ThemeToggle does: toggle `.dark` on <html>,
 * persist to localStorage, AND wrap the class change in the same
 * `.theme-swap` suppression window. That last part was missing here
 * entirely until this fix -- this function has always been a separate,
 * independent code path from ThemeToggle's own click handler (a real click
 * and an incoming postMessage were never going through the same code), so
 * fixing ThemeToggle's own desync left this one completely untouched. The
 * embedding docs site drives the theme here exclusively via postMessage
 * (see dashboard-showcase.tsx's "CRM demo 1" tab), so every theme flip this
 * app receives from that embed went through this exact unfixed path --
 * component hover/focus transitions firing at their own independent
 * durations in response to a theme change, not a real interaction, the
 * same class of bug already measured and fixed for a direct click.
 */
export function useEmbeddedThemeControl() {
  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark') => {
      const root = document.documentElement;
      root.classList.add(SUPPRESS_CLASS);
      void root.offsetHeight;

      root.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);

      const raf = requestAnimationFrame(() => root.classList.remove(SUPPRESS_CLASS));
      setTimeout(() => {
        cancelAnimationFrame(raf);
        root.classList.remove(SUPPRESS_CLASS);
      }, 100);
    };

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== MESSAGE_TYPE) return;
      if (data.theme !== 'light' && data.theme !== 'dark') return;
      applyTheme(data.theme);
    };

    window.addEventListener('message', onMessage);

    if (window.parent !== window) {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      window.parent.postMessage({ type: `${MESSAGE_TYPE}:ready`, theme: current }, '*');
    }

    return () => window.removeEventListener('message', onMessage);
  }, []);
}
