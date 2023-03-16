import React from "react";
import { render } from "@testing-library/react";
import Home from "../home/Home";

describe("Home", () => {
  it("should render correctly", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
