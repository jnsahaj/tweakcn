import { type NextConfig } from "next";

const nextConfig: NextConfig = {
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
