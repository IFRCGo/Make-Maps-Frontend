/*
DESCRIPTION: Defines GraphQL mutations using the Apollo Client library.
Includes mutations for creating, deleting, and updating Pin and Drawing Layer records.
*/
import { gql } from "@apollo/client";

export const ADD_PIN = gql`
  mutation PinCreateOneCustom($record: CreateOnePinInput!) {
    pinCreateOneCustom(record: $record) {
      record {
        _id
      }
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

export const ADD_DRAWING_LAYER = gql`
  mutation DrawingLayerCreateOneCustom($record: CreateOneDrawingLayerInput!) {
    drawingLayerCreateOneCustom(record: $record) {
      record {
        _id
      }
    }
  }
`;

export const DELETE_DRAWING_LAYER = gql`
  mutation DrawingLayerRemoveOneCustom($id: MongoID!) {
    drawingLayerRemoveOneCustom(_id: $id) {
      record {
        _id
      }
    }
  }
`;

export const UPDATE_DRAWING_LAYER = gql`
  mutation DrawingLayerUpdateByIdCustom(
    $id: MongoID!
    $record: UpdateByIdDrawingLayerInput!
  ) {
    drawingLayerUpdateByIdCustom(_id: $id, record: $record) {
      record {
        _id
      }
    }
  }
`;
