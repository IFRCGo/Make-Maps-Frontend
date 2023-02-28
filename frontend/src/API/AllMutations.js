import { gql } from "@apollo/client";

export const ADD_PIN = gql`
  mutation PinCreateOne($record: CreateOnePinInput!) {
    pinCreateOne(record: $record) {
      recordId
    }
  }
`;