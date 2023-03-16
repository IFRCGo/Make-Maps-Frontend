import React from "react";
import { render } from "@testing-library/react";
import CountryMap from "../map/CountryMap";

describe(CountryMap, () => {
  it("should render correctly", () => {
    const { container } = render(<CountryMap />);
    expect(container).toMatchSnapshot();
  });
});
