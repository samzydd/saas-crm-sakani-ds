import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// sakani-design-system is consumed as a local `file:` dependency (a sibling
// repo, not an npm-workspace member), so it resolves react/react-dom/lucide-react
// against its OWN node_modules rather than this app's. `dedupe` forces every
// import of these — including ones originating inside the linked package's
// dist — onto this app's single copy, avoiding duplicate-React/type errors.
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'lucide-react'],
  },
});
