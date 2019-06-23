import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
import { NormalizedCacheObject, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import introspectionResult from '@/generated/introspection-result';

import toolbarSchema from '../store/modules/toolbar.schema.graphql';
import localSessionSchema from '../store/modules/session.schema.graphql';
import linesSchema from '../store/modules/lines.schema.graphql';
import { resolver, initialStore } from '@/store/modules';

let jwtToken: string | undefined;

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token';

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql';

// Fragement Matcher
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache
  cache: new InMemoryCache({
    fragmentMatcher,
  }), // FIXME: To delete when vue-apollo will work

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...
  // Override the way the Authorization header is set
  getAuth: () => jwtToken,

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
  typeDefs: [toolbarSchema, localSessionSchema, linesSchema],
  resolvers: resolver,

  connectToDevTools: true,
};

defaultOptions.cache.writeData({ data: initialStore });

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  });
  apolloClient.wsClient = wsClient;
  apolloClient.onResetStore(async () => defaultOptions.cache.writeData({ data: initialStore }));

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
    },
  });

  return apolloProvider;
}

export default createProvider();

// Manually call this when user log in
export async function onLogin<TCacheShape = NormalizedCacheObject>(
  apolloClient: ApolloClient<TCacheShape> & { wsClient?: SubscriptionClient },
  token: string,
) {
  jwtToken = token;
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
}

// Manually call this when user log out
export async function onLogout<TCacheShape = NormalizedCacheObject>(apolloClient: ApolloClient<TCacheShape> & { wsClient?: SubscriptionClient }) {
  jwtToken = undefined;
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
  }
}
