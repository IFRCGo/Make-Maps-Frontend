/*
DESCRIPTION: Defines GraphQL subscriptions using the Apollo Client library.
Includes subscriptions for listening to changes in Disaster, Pin, and Drawing Layer records.
*/
import { gql } from "@apollo/client";

export const DISASTER_SUBSCRIPTION_QUERY = gql`
  subscription Subscription($id: MongoID!) {
    disasterSubscription(_id: $id) {
      pins
      drawingLayers
    }
  }
`;

export const PIN_ADDED_SUBSCRIPTION = gql`
  subscription PinAdded($disasterId: MongoID!) {
    pinAdded(disasterId: $disasterId) {
      disaster
      pinText
      pinCoordinates {
        type
        coordinates
      }
      createdBy
      _id
      createdAt
      updatedAt
    }
  }
`;

export const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription PinUpdated($disasterId: MongoID!) {
    pinUpdated(disasterId: $disasterId) {
      pinText
      pinCoordinates {
        coordinates
        type
      }
      _id
      createdAt
      createdBy
      disaster
      updatedAt
    }
  }
`;

export const PIN_REMOVED_SUBSCRIPTION = gql`
  subscription PinRemoved($disasterId: MongoID!) {
    pinRemoved(disasterId: $disasterId) {
      updatedAt
      pinText
      pinCoordinates {
        type
        coordinates
      }
      disaster
      createdBy
      createdAt
      _id
    }
  }
`;

export const DRAWING_LAYER_ADDED_SUBSCRIPTION = gql`
  subscription DrawingLayerAdded($disasterId: MongoID!) {
    drawingLayerAdded(disasterId: $disasterId) {
      disaster
      createdBy
      featureType
      featureGeoJSON
      _id
      createdAt
      updatedAt
    }
  }
`;

export const DRAWING_LAYER_UPDATED_SUBSCRIPTION = gql`
  subscription DrawingLayerUpdated($disasterId: MongoID!) {
    drawingLayerUpdated(disasterId: $disasterId) {
      featureGeoJSON
      _id
    }
  }
`;

export const DRAWING_LAYER_REMOVED_SUBSCRIPTION = gql`
  subscription DrawingLayerRemoved($disasterId: MongoID!) {
    drawingLayerRemoved(disasterId: $disasterId) {
      _id
    }
  }
`;
