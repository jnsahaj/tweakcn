import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
      rules: {
        '*.svg': {
          loaders: [
            {
              loader: '@svgr/webpack',
              options: {
                icon: true,
              },
            },
          ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
