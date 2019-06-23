import apolloProvider, { onLogin } from '../plugins/vue-apollo';
import localSessionQuery from './graphql/session/checkSession.graphql';
import registerSessionQuery from './graphql/session/registerSession.graphql';
import { CheckSessionQuery, CheckSessionQueryVariables, RegisterSessionMutation, RegisterSessionMutationVariables } from '@/generated/graphql';
import { login } from './UserService';

export async function getLocalSession() {
  const {
    data: {
      localState,
      localSession: { username },
    },
  } = await apolloProvider.defaultClient.query<CheckSessionQuery, CheckSessionQueryVariables>({ query: localSessionQuery });

  return { localState, username };
}

export async function createSession(username: string, password: string) {
  const session = await login({ username, password });

  await apolloProvider.defaultClient.mutate<RegisterSessionMutation, RegisterSessionMutationVariables>({
    mutation: registerSessionQuery,
    variables: { input: session },
  });

  // Subscribe session
  await onLogin(apolloProvider.defaultClient, session.authentificationToken);
}
