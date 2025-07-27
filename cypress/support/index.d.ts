// cypress/support/index.d.ts

import { Auth } from 'firebase/auth';
import './component'

declare global {
  namespace Cypress {
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

    interface AUTWindow {
      firebase_auth_instance?: Auth;
    }
     interface Window {
      firebase_auth_instance?: {
        onAuthStateChanged: (callback: (user: any) => void) => void;
      };
    }
  }
}