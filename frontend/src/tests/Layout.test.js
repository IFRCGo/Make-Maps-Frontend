import React from "react";
import { render } from "@testing-library/react";
import Layout from "../components/Layout";

describe("Layout", () => {
  it("should render correctly", () => {
    const { container } = render(<Layout />);
    expect(container).toMatchSnapshot();
  });
});
