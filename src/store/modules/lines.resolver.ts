import {
  WalletLine,
  ClearWalletLineInput,
  MutationUpdateClearLineArgs,
  GetLocalSessionQuery,
  UpdateLineMutation,
  UpdateLineMutationVariables,
  MutationCreateClearLineArgs,
  CreateLineMutation,
  CreateLineMutationVariables,
} from '@/generated/graphql';
import getLocalSessionQuery from '@/services/graphql/session/getLocalSession.graphql';
import updateLineQuery from '@/services/graphql/lines/updateLine.graphql';
import createLineQuery from '@/services/graphql/lines/createLine.graphql';
import getLineQuery from '@/services/graphql/lines/line.graphql';
import getLinesQuery from '@/services/graphql/lines/lines.graphql';
import groupQuery from '@/services/graphql/lines/group.graphql';
import { cardTypeMapping, decryptLineContent, encryptLineContent } from '@/services/ItemStoreService';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloCache } from 'apollo-cache';

export const resolver = {
  WalletLine: {
    async content(line: WalletLine, _: any, { cache }: { cache: ApolloCache<NormalizedCacheObject> }): Promise<ClearWalletLineInput> {
      const data = cache.readQuery<GetLocalSessionQuery>({ query: getLocalSessionQuery });
      if (!(data && data.localSession.masterKey)) {
        throw new Error('To decrypt content you should have a session');
      }
      return await decryptLineContent(line, data.localSession.masterKey);
    },

    typeLabel(line: WalletLine): string {
      return cardTypeMapping[line.type].label;
    },
    typeColor(line: WalletLine): string {
      return cardTypeMapping[line.type].color;
    },
    typeIcon(line: WalletLine): string {
      return cardTypeMapping[line.type].icon;
    },
  },

  Mutation: {
    async updateClearLine(
      _: any,
      { input }: MutationUpdateClearLineArgs,
      { client, cache }: { client: ApolloClient<NormalizedCacheObject>; cache: ApolloCache<NormalizedCacheObject> },
    ) {
      const data = cache.readQuery<GetLocalSessionQuery>({ query: getLocalSessionQuery });
      if (!(data && data.localSession.masterKey)) {
        throw new Error('To decrypt content you should have a session');
      }

      const line = await encryptLineContent(input, data.localSession.masterKey);
      const result = await client.mutate<UpdateLineMutation, UpdateLineMutationVariables>({
        mutation: updateLineQuery,
        variables: { input: line },
        refetchQueries: [{ query: getLineQuery, variables: { id: input._id } }, { query: groupQuery }],
        awaitRefetchQueries: true,
      });

      if (result.data && result.data.updateLine) {
        return result.data.updateLine;
      }

      throw new Error("Can't save the line on the server");
    },

    async createClearLine(
      _: any,
      { input }: MutationCreateClearLineArgs,
      { client, cache }: { client: ApolloClient<NormalizedCacheObject>; cache: ApolloCache<NormalizedCacheObject> },
    ) {
      const data = cache.readQuery<GetLocalSessionQuery>({ query: getLocalSessionQuery });
      if (!(data && data.localSession.masterKey)) {
        throw new Error('To decrypt content you should have a session');
      }

      const line = await encryptLineContent(input, data.localSession.masterKey);
      const result = await client.mutate<CreateLineMutation, CreateLineMutationVariables>({
        mutation: createLineQuery,
        variables: { input: line },
        refetchQueries: [{ query: getLinesQuery }, { query: groupQuery }],
        awaitRefetchQueries: true,
      });

      if (result.data && result.data.createLine) {
        return result.data.createLine;
      }

      throw new Error("Can't save the line on the server");
    },
  },
};

export const initialStore = {};
