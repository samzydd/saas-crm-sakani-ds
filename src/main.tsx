import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
// TEMP: @sakaniui/react's published ./tokens.css export is broken on the
// registry right now (points at a src/ path that npm's `files: ["dist"]`
// never actually publishes -- already fixed in that repo's source as
// 0.3.2, just not `npm publish`ed yet). Vendoring a copy here unblocks
// this app's build in the meantime -- swap back to the package import
// once 0.3.2+ is live: `import '@sakaniui/react/tokens.css';`
import './vendor-sakani-tokens.css';
import '@sakaniui/react/style.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
