import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: false,
      strict: true,
    }),
    files: {
      assets: "web/static",
      hooks: {
        client: "web/src/hooks.client",
        server: "web/src/hooks.server",
      },
      lib: "web/src/lib",
      routes: "web/src/routes",
      appTemplate: "web/src/app.html",
    },
  },
};

export default config;
