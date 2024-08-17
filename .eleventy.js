const path = require("path");
const htmlmin = require("html-minifier");
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const glslifyPlugin = require("vite-plugin-glslify").default;

// 11ty 2.0 only cjs i.e vite-plugin-glsl doesnt work(fully esm)

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 3000,
  });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    viteOptions: {
      publicDir: "public",
      root: "src",
      plugins: [glslifyPlugin()],

      resolve: {
        alias: {
          "@app": path.resolve(".", "/src/app"),
          "@styles": path.resolve(".", "/src/styles"),
          "@interfaces": path.resolve(".", "/src/interfaces"),
        },
      },
    },
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/app");
  eleventyConfig.addPassthroughCopy("src/interfaces");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "pug",
  };
};
