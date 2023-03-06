import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  ApolloProvider,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

// Create an HTTP link pointing to your GraphQL server's HTTP endpoint
const httpLink = new HttpLink({
  uri: "https://ifrc-go-make-maps-backend.azurewebsites.net/graphql", // replace with your server's HTTP endpoint
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://ifrc-go-make-maps-backend.azurewebsites.net/graphql",
  })
);

// Use the `split` method to conditionally route requests to either the HTTP or WebSocket link,
// depending on whether the request is a subscription or not.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Create an `ApolloClient` instance using the split link as the transport for all requests
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);
