import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { setContext } from "apollo-link-context";

// Create the apollo client
export default function createApolloClient({
  base,
  endpoints,
  token,
  persisting
}) {
  let link = new HttpLink({
    // You should use an absolute URL here
    uri: base + endpoints.graphql
  });

  // HTTP Auth header injection
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }));

  // Concat all the http link parts
  link = authLink.concat(link);
  if (persisting) {
    link = createPersistedQueryLink().concat(link);
  }

  // Apollo cache
  const cache = new InMemoryCache();

  // If on the client, recover the injected state
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-underscore-dangle
    const state = window.__APOLLO_STATE__;
    if (state) {
      // If you have multiple clients, use `state.<client_id>`
      cache.restore(state.defaultClient);
    }
  }

  const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: process.env.NODE_ENV !== "production"
  });

  return apolloClient;
}
