import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/admin',
  plugins: [react()],
  server: {
    // just for link tushan
    fs: {
      strict: mode === 'development' ? false : true,
    },
  },
}));
