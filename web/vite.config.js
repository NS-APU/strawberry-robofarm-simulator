import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const orionBaseUrl = env.VITE_ORION_BASE_URL || 'http://localhost';
  const orionApiPath = env.VITE_ORION_API_PATH || '/api/orion';

  return {
    plugins: [sveltekit()],
    server: {
      proxy: {
        [orionApiPath]: {
          target: orionBaseUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
