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
      assets: "static",
      hooks: {
        client: "src/hooks.client",
        server: "src/hooks.server",
      },
      lib: "src/lib",
      routes: "src/routes",
      appTemplate: "src/app.html",
    },
  },
};

export default config;
