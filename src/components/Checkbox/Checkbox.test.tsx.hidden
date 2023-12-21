import React, { useState } from "react";
import { render, screen, getByTestId, fireEvent } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  describe("Smoke test", () => {
    it("Should render. (smoke test)", () => {
      const props = {
        label: "The Label",
        valueKey: "valueKey", // will emit {[valueKey]: true | false}
        value: true,
      };
      render(<Checkbox label={props.label} valueKey={props.valueKey} />);
      const checkboxLabel = screen.getByText(/The Label/i);
      expect(checkboxLabel).toBeInTheDocument();
    });
    it("Should checkbox when clicked (default value 'false')", () => {
      const props = {
        label: "The Label",
        valueKey: "valueKey", // will emit {[valueKey]: true | false}
        value: false,
      };
      const Wrap = () => {
        // const [isChecked, setIsChecked] = useState(false);
        return (
          <Checkbox
            label={props.label}
            valueKey={props.valueKey}
            initialValue={props.value}
          />
        );
      };
      const { container } = render(<Wrap />);
      const checkbox = container.querySelectorAll(
        "input[type='checkbox']"
      )[0] as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });
    it("Should checkbox when clicked (default value 'true')", () => {
      const props = {
        label: "The Label",
        valueKey: "valueKey", // will emit {[valueKey]: true | false}
        value: true,
      };
      const Wrap = () => {
        // const [isChecked, setIsChecked] = useState(false);
        return (
          <Checkbox
            label={props.label}
            valueKey={props.valueKey}
            initialValue={props.value}
          />
        );
      };
      const { container } = render(<Wrap />);
      const checkbox = container.querySelectorAll(
        "input[type='checkbox']"
      )[0] as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });
  describe("Optional Controlled component", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("Should call onChange function when clicked to true state.", () => {
      const eventHandler = (checkboxValue: {
        [keyValue: string]: boolean;
      }) => {};

      const props = {
        label: "The Label",
        valueKey: "valueKey1", // will emit {[valueKey]: true | false}
        value: false,
        onChange: jest.fn(),
      };
      const Wrap = () => {
        return (
          <Checkbox
            label={props.label}
            valueKey={props.valueKey}
            initialValue={props.value}
            onChange={props.onChange}
          />
        );
      };
      // const spyOnClick = jest.spyOn(Wrap, "click");
      const { container } = render(<Wrap />);
      const checkbox = container.querySelectorAll(
        "input[type='checkbox']"
      )[0] as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(props.onChange).toHaveBeenCalledWith({
        valueKey: "valueKey1",
        isChecked: true,
      });

      // expect(props.onClick).toHaveBeenCalled();
    });
    it("Should call onChange function when clicked to false state.", () => {
      const eventHandler = (checkboxValue: {
        [keyValue: string]: boolean;
      }) => {};

      const props = {
        label: "The Label",
        valueKey: "valueKeyB", // will emit {[valueKey]: true | false}
        value: true,
        onChange: jest.fn(),
      };
      const Wrap = () => {
        return (
          <Checkbox
            label={props.label}
            valueKey={props.valueKey}
            initialValue={props.value}
            onChange={props.onChange}
          />
        );
      };
      // const spyOnClick = jest.spyOn(Wrap, "click");
      const { container } = render(<Wrap />);
      const checkbox = container.querySelectorAll(
        "input[type='checkbox']"
      )[0] as HTMLInputElement;
      fireEvent.click(checkbox);
      expect(props.onChange).toHaveBeenCalledWith({
        valueKey: "valueKeyB",
        isChecked: false,
      });

      // expect(props.onClick).toHaveBeenCalled();
    });
  });
});
