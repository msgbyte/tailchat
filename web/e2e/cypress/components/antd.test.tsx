import React from 'react';
import { mount } from '@cypress/react';
import { Button } from 'antd';
import { TestWrapper } from './utils/TestWrapper';

describe('antd dark', () => {
  it('antd button', () => {
    mount(
      <TestWrapper>
        <Button data-testid="default">默认</Button>
        <Button type="primary" data-testid="primary">
          主色
        </Button>
        <Button danger={true} type="primary" data-testid="primary-danger">
          主危险
        </Button>
      </TestWrapper>
    );

    cy.get('[data-testid=default]')
      .should('have.css', 'color', 'rgba(255, 255, 255, 0.65)')
      .should('have.css', 'border-color', 'rgb(67, 67, 67)')
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      .matchImageSnapshot('default');

    cy.get('[data-testid=primary]')
      .should('have.css', 'color', 'rgb(255, 255, 255)')
      .should('have.css', 'border-color', 'rgb(23, 125, 220)')
      .should('have.css', 'background-color', 'rgb(23, 125, 220)')
      .matchImageSnapshot('primary');

    cy.get('[data-testid=primary-danger]')
      .should('have.css', 'color', 'rgb(255, 255, 255)')
      .should('have.css', 'border-color', 'rgb(166, 29, 36)')
      .should('have.css', 'background-color', 'rgb(166, 29, 36)')
      .matchImageSnapshot('primary-danger');
  });
});
