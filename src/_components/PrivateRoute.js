import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import io from "socket.io-client";
import config from "config";

import { getDynamicConfig } from '../_helpers/dynamicConfig';

const GRAPHQL_URL = getDynamicConfig().apiUrlRT;

//SOCKET
const URL = getDynamicConfig().API_CASIER_RT_V2;
const socketRaces = io(URL, {
  path: '/ws',
  autoConnect: true,
  transports: ["websocket"],
  auth: {
    authorization: localStorage.getItem('token')
  }
});

// Create an http link:
const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

var client = null;

const getClient = (props) => {

  if (client != null) {
    return client;
  }

  const token = localStorage.getItem("token");

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: GRAPHQL_URL.replace(/^https/, "wss").replace(/^http/, "ws"),
    options: {
      reconnect: true,
      connectionParams: token
        ? {
          authorization: `Bearer ${token}`,
        }
        : {},
    },
  });

  const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
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



  client = new ApolloClient({ link: ApolloLink.from([onErrorHandler, link]), cache: new InMemoryCache() });

  return client;
}


export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("token") ? (
        <ApolloProvider client={getClient(props)}>
          {" "}
          <Component {...props} socketRaces={socketRaces} />{" "}
        </ApolloProvider>
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);
