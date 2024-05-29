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
    specPattern: [
      'cypress/e2e/root.cy.ts',
      'cypress/e2e/kloc.cy.ts',
      'cypress/e2e/stopwatch.cy.ts',
      'cypress/e2e/timer.cy.ts',
      'cypress/e2e/sharing.cy.ts',
    ],
  },
  env: { baseUrl },
})
