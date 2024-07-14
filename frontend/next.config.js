/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // images: {
    // loader: "custom",
    // loaderFile: "./src/functions/loader.js"
  // },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: {
      // allowedForwardedHosts: ['localhost', 'symmetrical-xylophone-45vw4477g3j4xx-3000.app.github.dev'],
      // allowedOrigins: ['*.app.github.dev']
    },
  },
  

  // basePath: "https://symmetrical-xylophone-45vw4477g3j4xx-3000.app.github.dev"


};

export default config;
