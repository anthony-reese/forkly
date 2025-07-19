import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://forkly-phi.vercel.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
