/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('when rendered', () => {
    it('should render the checkbox', () => {
      render(<Checkbox label="test" valueKey="test" />);
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeInTheDocument();
    });
  });
});
