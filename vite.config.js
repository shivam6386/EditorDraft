import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'window',  // Define global as window for browser compatibility
  },
});
