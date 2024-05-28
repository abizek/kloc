import codeCoverage from '@cypress/code-coverage/task'
import { defineConfig } from 'cypress'

const baseUrl = 'http://localhost:5173'

export default defineConfig({
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      codeCoverage(on, config)

      return config
    },
    viewportHeight: 720,
    viewportWidth: 1280,
    experimentalRunAllSpecs: true,
  },
  env: { baseUrl },
})
