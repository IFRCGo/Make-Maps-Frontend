import { gql } from "@apollo/client";

export const DISASTER_SUBSCRIPTION_QUERY = gql`
  subscription Subscription($id: MongoID!) {
    disasterSubscription(_id: $id) {
      pins
      drawingLayers
    }
  }
`;
