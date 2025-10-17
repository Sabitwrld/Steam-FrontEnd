import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      proxy: {
        // HEDEF PORTU 5280 OLARAK GÜNCELLENDİ
        '/api': 'http://localhost:5280'
      }
    },
    build: {
      outDir: 'build', // Genellikle 'build' klasörü kullanılır
      emptyOutDir: true
    },
    plugins: [react()],
  };
});