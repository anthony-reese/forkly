// src/types/global.d.ts
import { Auth } from 'firebase/auth'; // Import Auth type from Firebase

declare global {
  interface Window {
    Cypress?: object; // Cypress is often added to window during testing
    firebase_auth_instance?: Auth; // Declare the custom property for Firebase Auth
  }
}