import type { NextConfig } from "next";
import i18nConfig from "./next-i18next.config.js";
import { withGlobalCss } from "next-global-css";

// Base next.js config - i18n destekli
const nextConfig: NextConfig = {
  reactStrictMode: false,
  i18n: i18nConfig.i18n, // i18n ayarlarını burada tutuyoruz
  images: {
    domains: ["localhost"],
  },
  devIndicators: false,
};

const globalCssConfig = withGlobalCss({
  includePaths: ["src/components"],
});

export default globalCssConfig(nextConfig);
