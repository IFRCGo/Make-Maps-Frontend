import { useQuery, gql } from "@apollo/client";

const ALL_DISASTERS = gql`
  query DisasterById {
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

export function DisplayLocations() {
  const { loading, error, data } = useQuery(ALL_DISASTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.disasterMany.map(({ _id, amount_funded, amount_requested }) => (
    <div key={_id}>
      <h3>{amount_funded}</h3>
      <br />
      <b>About this location:</b>
      <p>{amount_requested}</p>
      <br />
    </div>
  ));
}
