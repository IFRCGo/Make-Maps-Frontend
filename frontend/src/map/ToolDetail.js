import React from "react";
import { Card } from "antd";
import "./ToolDetail.css";

const ToolDetail = ({ 
  cardOpen,
}) => {
  return (
    <div style={{ display: cardOpen === false ? "none" : "initial" }}>
      <Card 
        className="tool-card"
        title="Tool card detail" 
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
    
  )
}

export default ToolDetail