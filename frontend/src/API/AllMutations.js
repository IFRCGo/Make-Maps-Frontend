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

export const ADD_DRAWING_LAYER = gql`
  mutation DrawingLayerCreateOne($record: CreateOneDrawingLayerInput!) {
    drawingLayerCreateOne(record: $record) {
      recordId
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
