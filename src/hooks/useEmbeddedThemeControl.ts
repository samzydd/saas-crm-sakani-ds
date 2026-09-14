import { useEffect } from 'react';

const STORAGE_KEY = 'theme';
const MESSAGE_TYPE = 'sakani-crm:set-theme';

/**
 * Lets a parent window (the docs site embedding this app in an <iframe>)
 * flip this app's theme from the outside — the app itself has no way to
 * know it's embedded, and the parent is a different origin so it can't
 * reach into this document's classList/localStorage directly. A
 * postMessage listener is the one channel two different origins actually
 * share.
 *
 * Applies theme exactly the way ThemeToggle does (toggle `.dark` on
 * <html>, persist to localStorage) so the two stay in sync regardless of
 * which one last changed it. Also announces readiness + current theme on
 * mount, so an embedding page can sync its own toggle's initial state
 * without guessing or racing the iframe's load event.
 */
export function useEmbeddedThemeControl() {
  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark') => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);
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
