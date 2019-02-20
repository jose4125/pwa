module.exports = {
  globDirectory: "app/",
  globPatterns: ["**/*.{html,css,json,js}", "images/*.{jpg,png,svg}"],
  globIgnores: ["help/**"],
  swSrc: "app/sw-base.js",
  swDest: "app/sw.js"
};
