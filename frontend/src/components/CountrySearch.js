import React, { useState } from 'react';
import { Select } from 'antd';
import { useNavigate } from "react-router-dom";

const options=[
  {
    value: 'Country1 - blood',
    label: 'Country1 - blood',
    id: 1,
  },
  {
    value: 'Country1 - earthquake',
    label: 'Country1 - earthquake',
  },
  {
    value: 'Country2 - blood',
    label: 'Country2 - blood',
  },
]

const CountrySearch = ({ locations }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(`/map/${options[0].id}`)
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
      options={options}
      placeholder="Search the country"
      onSelect={() => handleSelect()}
    />
  );
}

export default CountrySearch