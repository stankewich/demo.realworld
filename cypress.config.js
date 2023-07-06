const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      "baseUrl": "https://demo.realworld.io/",
      "defaultCommandTimeout": 10000,
      "supportFile": false,
      "watchForFileChanges": false,
  }
});
