import React from "react";
import { Card } from "antd";

const DisasterInfoCard = () => {
  return (
    <div style={{ zIndex: 999 }}>
      <Card
        title="Default size card"
        style={{
          zIndex: 999,
          width: 300,
        }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  );
};

export default DisasterInfoCard;
