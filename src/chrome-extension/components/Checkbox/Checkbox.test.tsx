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
    it('should render the label', () => {
      render(<Checkbox label="test" valueKey="test" />);
      const label = screen.getByText('test');
      expect(label).toBeInTheDocument();
    });
  });
  describe('when checked', () => {
    it('should render the checkbox as checked', () => {
      render(<Checkbox label="test" valueKey="test" initialValue={true} />);
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeChecked();
    });
    it('should render the checkbox as unchecked', () => {
      render(<Checkbox label="test" valueKey="test" initialValue={false} />);
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).not.toBeChecked();
    });
    it('should render the checkbox as checked when value is provided', () => {
      render(
        <Checkbox
          label="test"
          valueKey="test"
          initialValue={true}
          value={true}
        />
      );
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeChecked();
    });
    it('should render the checkbox as checked when value is *not* provided', () => {
      render(<Checkbox label="test" valueKey="test" value={true} />);
      const checkbox = screen.getByTestId('checkbox-input');
      expect(checkbox).toBeChecked();
    });
  });
  describe('when clicked', () => {
    it('should render the checkbox as checked', () => {
      render(<Checkbox label="test" valueKey="test" initialValue={false} />);
      const checkbox = screen.getByTestId('checkbox-input');
      checkbox.click();
      expect(checkbox).toBeChecked();
    });
    it('should render the checkbox as unchecked', () => {
      render(<Checkbox label="test" valueKey="test" initialValue={true} />);
      const checkbox = screen.getByTestId('checkbox-input');
      checkbox.click();
      expect(checkbox).not.toBeChecked();
    });
  });
  describe('when onChange is provided', () => {
    it('should call onChange when clicked', () => {
      const onChange = jest.fn();
      render(
        <Checkbox
          label="test"
          valueKey="test"
          initialValue={true}
          onChange={onChange}
        />
      );
      const checkbox = screen.getByTestId('checkbox-input');
      checkbox.click();
      expect(onChange).toHaveBeenCalled();
    });
    it('should call onChange with the correct arguments', () => {
      const onChange = jest.fn();
      render(
        <Checkbox
          label="test"
          valueKey="test"
          initialValue={true}
          onChange={onChange}
        />
      );
      const checkbox = screen.getByTestId('checkbox-input');
      checkbox.click();
      expect(onChange).toHaveBeenCalledWith({
        valueKey: 'test',
        isChecked: false,
      });
    });
  });
});
