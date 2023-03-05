import React from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const CountrySearch = ({ disasters }) => {
  // add label and value to display the option in search bar
  const locationOptions = disasters.map((item) => ({
    ...item,
    label: item.location,
    value: item.location,
  }));

  const navigate = useNavigate();
  const handleSelect = (value) => {
    const disaster = locationOptions.find((option) => value === option.value);
    navigate(
      `map/${disaster._id}/${disaster.disasterCoordinates.coordinates[0]}/${disaster.disasterCoordinates.coordinates[1]}`
    );
    // refresh the page
    navigate(0);
  };

  return (
    <Select
      showSearch
      allowClear
      style={{
        width: 250,
      }}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={locationOptions}
      placeholder="Search the country"
      onSelect={(value) => handleSelect(value)}
    />
  );
};

export default CountrySearch;
