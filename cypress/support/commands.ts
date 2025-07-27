// cypress/support/commands.ts
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// @ts-check

Cypress.Commands.add('login', (mockUser = { uid: 'mockUserId123', email: 'test@example.com', displayName: 'Test User' }) => {
  cy.window().then((win) => {
    if (!win.Cypress || !win.firebase_auth_instance) {
      throw new Error("Firebase 'auth' instance not found on window. Ensure it's exposed for testing.");
    }

    const authInstance = win.firebase_auth_instance;

    const onAuthStateChangedStub = cy.stub(authInstance, 'onAuthStateChanged').callsFake((callback) => {
      callback(mockUser as any); 

      return () => {
      };
    }).as('onAuthStateChangedStub');

    cy.wait(50);
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    if (!win.Cypress || !win.firebase_auth_instance) {
      return;
    }

    const authInstance = win.firebase_auth_instance;

    const onAuthStateChanged = authInstance.onAuthStateChanged as 
      ((callback: (user: any) => void) => void) & { restore?: () => void };

    if (onAuthStateChanged.restore) {
      onAuthStateChanged.restore();
    }

    cy.stub(authInstance, 'onAuthStateChanged')
      .callsFake((callback) => {
        callback(null);
        return () => {}; // unsub
      })
      .as('onAuthStateChangedLogoutStub');

    cy.wait(50);
  });
});

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to 'login' a user by mocking Firebase's onAuthStateChanged.
     * @example cy.login()
     * @example cy.login({ uid: 'anotherId', email: 'another@example.com' })
     */
    login(user?: { uid: string; email: string; displayName?: string }): Chainable<AUTWindow>;
    /**
     * Custom command to 'logout' a user by mocking Firebase's onAuthStateChanged to null.
     * @example cy.logout()
     */
    logout(): Chainable<AUTWindow>;
  }
}