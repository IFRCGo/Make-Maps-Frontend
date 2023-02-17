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
