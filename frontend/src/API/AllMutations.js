import { gql } from "@apollo/client";

export const ADD_PIN = gql`
  mutation PinCreateOne($record: CreateOnePinInput!) {
    pinCreateOne(record: $record) {
      recordId
    }
  }
`;

export const DELETE_PIN = gql`
  mutation PinRemoveOne($filter: FilterRemoveOnePinInput) {
    pinRemoveOne(filter: $filter) {
      recordId
    }
  }
`;

export const UPDATE_PIN = gql`
  mutation Mutation($id: MongoID!, $record: UpdateByIdPinInput!) {
    pinUpdateById(_id: $id, record: $record) {
      recordId
    }
  }
`;
