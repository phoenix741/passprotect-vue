import config from '@/config.yml';
import { generateKey, encrypt, decrypt, getEncryptedContent } from '@/utils/crypto';
import { parseErrors, FieldError } from '../utils/errors';
import { ICredential } from '@/types/ICredential';
import apolloProvider from '@/plugins/vue-apollo';
import createSession from '@/services/graphql/user/createSession.graphql';
import registerUser from '@/services/graphql/user/registerUser.graphql';
import {
  User,
  CreateSessionMutationVariables,
  CreateSessionMutation,
  CreateSessionResult,
  RegisterUserMutationVariables,
  RegisterUserMutation,
  Errors,
  ConnectionInformation,
} from '@/generated/graphql';

export async function login(creds: ICredential) {
  const response = await apolloProvider.defaultClient.mutate<CreateSessionMutation, CreateSessionMutationVariables>({
    mutation: createSession,
    variables: { input: creds },
  });

  if (!response || !response.data || !response.data.createSession) {
    throw new Error('login.form.username.help.unknown');
  }

  const hasError = (tbd: CreateSessionResult): tbd is Errors => !!(tbd as Errors).errors;
  if (hasError(response.data.createSession)) {
    parseErrors(response.data.createSession);
  }

  const isConnected = (tbd: CreateSessionResult): tbd is ConnectionInformation => !!(tbd as ConnectionInformation).token;
  if (!isConnected(response.data.createSession)) {
    throw new Error('login.form.username.help.unknown');
  }

  const masterKey = await createClearKey(response.data.createSession.user, creds.password);
  return {
    username: response.data.createSession.user._id,
    authentificationToken: response.data.createSession.token,
    masterKey,
  };
}

export async function signup(creds: ICredential) {
  const encryption = await generateMasterKey(creds.username, creds.password);
  const result = await apolloProvider.defaultClient.mutate<RegisterUserMutation, RegisterUserMutationVariables>({
    mutation: registerUser,
    variables: {
      input: {
        _id: creds.username,
        password: creds.password,
        encryption: {
          salt: encryption.salt.toString(),
          authTag: encryption.authTag.toString(),
          content: encryption.content.toString(),
          iv: encryption.iv.toString(),
        },
      },
    },
  });

  if (!(result && result.data && result.data.registerUser)) {
    throw new FieldError('login.form.username.help.unknown');
  }
  parseErrors(result.data.registerUser);
}

export async function generateMasterKey(user: string, password: string) {
  const masterKey = await generateKey(config.crypto.keySize);

  return encrypt(masterKey, password, config.crypto);
}

export async function createClearKey(user: User, password: string) {
  const clearKey = await decrypt(getEncryptedContent(user.encryption), password, config.crypto);

  return clearKey.toString('binary');
}
