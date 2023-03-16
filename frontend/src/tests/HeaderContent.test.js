import React from "react";
import { render } from "@testing-library/react";
import HeaderContents from "../components/HeaderContents";

describe("HeaderContent", () => {
  it("should render correctly", () => {
    const { container } = render(<HeaderContents />);
    expect(container).toMatchSnapshot();
  });
});
