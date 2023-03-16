import React from "react";
import { render } from "@testing-library/react";
import ToolBar from "../map/ToolBar";

describe(ToolBar, () => {
  it("should render correctly", () => {
    const { container } = render(<ToolBar />);
    expect(container).toMatchSnapshot();
  });
});
