import { MutationRegisterSessionArgs } from '@/generated/graphql';
import getSessionQuery from '@/services/graphql/session/getLocalSession.graphql';

export const resolver = {
  Query: {
    localState() {
      // Should check if there is a state in storage
      return false;
    },
  },
  Mutation: {
    registerSession(_: any, { input }: MutationRegisterSessionArgs, { cache }: any) {
      const localSession = Object.assign({ __typename: 'LocalSession' }, input);
      cache.writeQuery({ query: getSessionQuery, data: { localSession } });
      return true;
    },
  },
};

export const initialStore = {
  localSession: {
    __typename: 'LocalSession',
    username: null,
    masterKey: null,
    authentificationToken: null,
  },
};
