import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173",
    testIsolation: false
  },
  projectId: process.env.CYPRESS_PROJECT_ID
  // uncomment these after the secrets are configured
  // record: true, // Enable test recording
  // key: process.env.CYPRESS_RECORD_KEY // Cypress record key
});
