import { useQuery } from "@apollo/client";
import * as Query from "./API/AllQueries";

export default function TestAPI() {
  const { loading, error, data } = useQuery(Query.ALL_DISASTERS);

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
