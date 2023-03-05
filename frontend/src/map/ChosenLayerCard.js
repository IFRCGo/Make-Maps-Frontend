import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

const ChosenLayerCard = ({ currentLayers }) => {
  return (
    <Collapse
      expandIconPosition="end"
      style={{ backgroundColor: "white", margin: 20 }}
    >
      <Panel
        header="Layer Information"
        key="2"
        style={{ width: 300, fontSize: 18 }}
      >
        {currentLayers !== [] ? (
          currentLayers.map((layer, index) => <h4 key={index}>{layer}</h4>)
        ) : (
          <></>
        )}
      </Panel>
    </Collapse>
  );
};

export default ChosenLayerCard;
