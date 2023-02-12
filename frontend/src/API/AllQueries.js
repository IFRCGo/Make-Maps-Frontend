import { gql } from "@apollo/client";
export const ALL_DISASTERS = gql`
  query disasterMany {
    disasterMany {
      _id
      amount_funded
      amount_requested
      createdAt
      createdBy
      date
    }
  }
`;
