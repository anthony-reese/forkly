import React from 'react'
import { PromoEmail } from './PromoEmail'

describe('<PromoEmail />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PromoEmail />)
  })
})