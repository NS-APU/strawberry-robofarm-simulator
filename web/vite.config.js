import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const orionEndpoint = env.VITE_ORION_ENDPOINT || 'http://localhost/api/orion/';
  const target = new URL(orionEndpoint).origin;

  return {
    plugins: [sveltekit()],
    server: {
      proxy: {
        '/api/orion': {
          target: target,
          changeOrigin: true,
        },
        '/ngsi-ld': {
          target: target,
          changeOrigin: true,
        },
      },
    },
  };
});
