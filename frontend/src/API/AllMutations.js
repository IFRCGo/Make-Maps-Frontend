import { gql } from "@apollo/client";

export const ADD_PIN = gql`
  mutation PinCreateOne($record: CreateOnePinInput!) {
    pinCreateOne(record: $record) {
      recordId
    }
  }
`;

export const DELETE_PIN = gql`
  mutation PinRemoveOneCustom($id: MongoID!) {
    pinRemoveOneCustom(_id: $id) {
      record {
        _id
      }
    }
  }
`;

export const UPDATE_PIN = gql`
  mutation PinUpdateByIdCustom($id: MongoID!, $record: UpdateByIdPinInput!) {
    PinUpdateByIdCustom(_id: $id, record: $record) {
      record {
        _id
      }
    }
  }
`;
