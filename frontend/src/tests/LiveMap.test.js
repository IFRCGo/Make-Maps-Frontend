import React from "react";
import { render } from "@testing-library/react";
import LiveMap from "../map/LiveMap";

describe("LiveMap", () => {
  it("should render correctly", () => {
    const { container } = render(<LiveMap />);
    expect(container).toMatchSnapshot();
  });
});
