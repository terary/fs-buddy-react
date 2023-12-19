import React, { useState } from "react";
import { render, screen, getByTestId, fireEvent } from "@testing-library/react";
import { CheckboxArray } from "./CheckboxArray";

const _checkboxesProps = {
  one: {
    label: "The One",
    value: true,
  },
  two: {
    label: "The Two",
    value: false,
  },
  three: {
    label: "The Three",
    value: true,
  },
};

describe("Checkbox", () => {
  let checkboxesProps: any;
  beforeEach(() => {
    checkboxesProps = { ..._checkboxesProps };
  });
  describe("Smoke test", () => {
    it("Should render. (smoke test)", () => {
      render(<CheckboxArray props={checkboxesProps} />);
      const checkboxesContainer = screen.getByTestId(
        "checkbox-array-container"
      );
      const checkboxes = checkboxesContainer.querySelectorAll(
        "input[type='checkbox']"
      ); // [0] as HTMLInputElement;
      expect(checkboxes.length).toStrictEqual(3);

      expect(screen.getByLabelText(/The One/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/The Two/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/The Three/i)).toBeInTheDocument();
    });
  });
  describe(".onChange", () => {
    it("Should call onChange function when clicked to true state.", () => {
      const expected = {
        one: {
          label: "The One",
          value: false,
        },
        two: {
          label: "The Two",
          value: false,
        },
        three: {
          label: "The Three",
          value: true,
        },
      };

      const props = {
        onChange: jest.fn(),
      };
      const Wrap = () => {
        return (
          <CheckboxArray props={checkboxesProps} onChange={props.onChange} />
        );
      };
      const { container } = render(<Wrap />);
      const checkboxes = container.querySelectorAll(
        "input[type='checkbox']"
      ) as NodeListOf<Element>;
      expect(checkboxes.length).toStrictEqual(3);

      fireEvent.click(checkboxes[0]);
      expect(props.onChange).toHaveBeenCalledWith(expected);

      // expect(props.onClick).toHaveBeenCalled();
    });
  });
});
