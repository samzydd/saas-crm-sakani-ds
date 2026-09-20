import { useEffect } from 'react';
import { getTheme, setTheme } from '../lib/theme';

const MESSAGE_TYPE = 'sakani-crm:set-theme';

/**
 * Lets a parent window (the docs site embedding this app in an <iframe>) flip
 * this app's theme from the outside — the app has no way to know it's
 * embedded, and the parent is a different origin so it can't reach into this
 * document directly. postMessage is the one channel two origins share.
 *
 * Delegates to the shared theme store rather than touching the DOM itself, so
 * an embedded flip is indistinguishable from a click on the header toggle:
 * same transition suppression, and the toggle's own switch/icons/label follow
 * along instead of staying frozen in the previous theme.
 *
 * Also announces readiness and the current theme on mount, so the embedding
 * page can sync its own control without racing this iframe's load.
 */
export function useEmbeddedThemeControl() {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== MESSAGE_TYPE) return;
      if (data.theme !== 'light' && data.theme !== 'dark') return;
      setTheme(data.theme);
    };

    window.addEventListener('message', onMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: `${MESSAGE_TYPE}:ready`, theme: getTheme() }, '*');
    }

    return () => window.removeEventListener('message', onMessage);
  }, []);
}
