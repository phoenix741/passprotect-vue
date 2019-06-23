declare module 'vue-cli-plugin-apollo/graphql-client' {
  import { ApolloCache } from 'apollo-cache';
  import { InMemoryCacheConfig, NormalizedCacheObject } from 'apollo-cache-inmemory';
  import { ApolloClient, ApolloClientOptions } from 'apollo-client';
  import { ApolloLink, FetchResult, NextLink, Observable, Operation } from 'apollo-link';
  import { HttpOptions, UriFunction } from 'apollo-link-http-common';
  import { ClientStateConfig } from 'apollo-link-state';
  import { SubscriptionClient } from 'subscriptions-transport-ws';

  export interface CreateApolloClientOptions<TCacheShape = NormalizedCacheObject> {
    httpEndpoint?: string | UriFunction | undefined;
    wsEndpoint?: string | null;
    tokenName?: string;
    persisting?: boolean;
    ssr?: boolean;
    websocketsOnly?: boolean;
    link?: ApolloLink | null;
    defaultHttpLink?: boolean;
    httpLinkOptions?: HttpOptions;
    cache?: ApolloCache<TCacheShape> | null;
    inMemoryCacheOptions?: InMemoryCacheConfig | null;
    apollo?: ApolloClientOptions<TCacheShape>;
    clientState?: ClientStateConfig | null;
    getAuth?: (tokenName: string) => string | undefined;
  }

  export interface CreatedApolloClient<TCacheShape = NormalizedCacheObject> {
    apolloClient: ApolloClient<TCacheShape> & {
      wsClient?: SubscriptionClient;
    };
    wsClient?: SubscriptionClient;
    stateLink?: {
      writeDefaults(): void;
      request(operation: Operation, forward?: NextLink): Observable<FetchResult<Record<string, any>, Record<string, any>>>;
      split(
        test: (op: Operation) => boolean,
        left: ApolloLink | ((operation: Operation, forward?: NextLink) => Observable<FetchResult<Record<string, any>, Record<string, any>>>),
        right?: ApolloLink | ((operation: Operation, forward?: NextLink) => Observable<FetchResult<Record<string, any>, Record<string, any>>>),
      ): ApolloLink;
      concat(
        next: ApolloLink | ((operation: Operation, forward?: NextLink) => Observable<FetchResult<Record<string, any>, Record<string, any>>>),
      ): ApolloLink;
    };
  }

  export function createApolloClient<TCacheShape = NormalizedCacheObject>({
    httpEndpoint,
    wsEndpoint,
    tokenName,
    persisting,
    ssr,
    websocketsOnly,
    link,
    defaultHttpLink,
    httpLinkOptions,
    cache,
    inMemoryCacheOptions,
    apollo,
    clientState,
    getAuth,
  }: CreateApolloClientOptions<TCacheShape>): CreatedApolloClient<TCacheShape>;
  export function restartWebsockets(wsClient: SubscriptionClient): void;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const content: DocumentNode;
  export default content;
}
