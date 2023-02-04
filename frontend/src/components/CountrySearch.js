import React from 'react';
import { Select } from 'antd';
import { useNavigate } from "react-router-dom";

const CountrySearch = ({ locations }) => {
  // add label and value to display the option in search bar
  const locationOptions = locations.map((location) => {
    location.label = location.country;
    location.value = location.country;
    return location;
  });

  const navigate = useNavigate();
  const handleSelect = (value) => {
    const locationData = locationOptions.find(option => value === option.value);
    navigate(`map/${locationData.disasterLocation.x}/${locationData.disasterLocation.y}`)
    // refresh the page
    navigate(0)
  }

  return (
    <Select
      showSearch
      allowClear
      style={{
        width: 250,
      }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={locationOptions}
      placeholder="Search the country"
      onSelect={(value) => handleSelect(value)}
    />
  );
}

export default CountrySearch