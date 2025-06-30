/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "tr"],
    localeDetection: false,
  },
  defaultNS: "common",
  localePath:
    typeof window === "undefined" ? require("path").resolve("./public/locales") : "/public/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
