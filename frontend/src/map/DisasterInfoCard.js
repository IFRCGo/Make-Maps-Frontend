import React from "react";
import { Collapse, Card } from "antd";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

const { Meta } = Card;
const { Panel } = Collapse;

const gridStyle = {
  width: "50%",
  textAlign: "center",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",
};

const DisasterInfoCard = ({ countryData }) => {
  return (
    <Collapse
      expandIconPosition="end"
      style={{ backgroundColor: "white", margin: 20 }}
    >
      <Panel
        header={countryData.location}
        key="1"
        style={{ width: 300, fontSize: 18 }}
      >
        <Card>
          <Card.Grid hoverable={false} style={gridStyle}>
            <div
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <GiReceiveMoney style={{ color: "red", fontSize: "4em" }} />
              <Meta
                title={new Intl.NumberFormat("en-US").format(
                  parseInt(countryData.amount_requested)
                )}
                description="Amount Requested (CHF)"
              />
            </div>
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            <div
              style={{
                flexDirection: "row",
                flex: 1,
                justifyConxtent: "space-around",
              }}
            >
              <GiPayMoney style={{ color: "red", fontSize: "4em" }} />
              <Meta
                title={new Intl.NumberFormat("en-US").format(
                  parseInt(countryData.amount_funded)
                )}
                description="Amount Funded (CHF)"
              />
            </div>
          </Card.Grid>
        </Card>
        <Card
          title="Emergency Overview"
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          {countryData.disasterInformation}
        </Card>
      </Panel>
    </Collapse>
  );
};

export default DisasterInfoCard;
