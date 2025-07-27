/// <reference types="cypress" />

import React from 'react'
import { PromoEmail } from './PromoEmail'

describe('PromoEmail', () => {
  it('renders', () => {
    cy.mount(<PromoEmail name="Forkly" bizName="Forkly" />);
  });
});