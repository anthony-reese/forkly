// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './component'
Cypress.on('uncaught:exception', (err) => {
  // Optional: Add a condition if needed
  if (err.message.includes('Search failed')) {
    return false; // prevents Cypress from failing the test
  }
});