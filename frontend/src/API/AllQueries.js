import { gql } from "@apollo/client";

export const GET_DISASTERS = gql`
  query GetDisasters {
    disasterMany {
      _id
      date
      disasterName
      disasterType
      disasterInformation
      amount_requested
      amount_funded
      location
      disasterCoordinates {
        coordinates
      }
    }
  }
`;

export const GET_PINS = gql`
  query PinQuery($filter: FilterFindManyPinInput) {
    pinMany(filter: $filter) {
      disaster
      pinText
      date
      pinCoordinates {
        coordinates
      }
      createdBy
      _id
    }
  }
`;
