export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Convert Base64 to Buffer */
  Buffer: string;
  /** Date in format Timestamp */
  Date: string;
  /** Convert String to ObjectID */
  ObjectID: string;
};

export enum CardTypeEnum {
  Card = 'card',
  Password = 'password',
  Text = 'text',
}

export type ClearLineCreateInput = {
  type: LineTypeEnum;
  label: Scalars['String'];
  group: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  content: ClearWalletLineInput;
};

export type ClearLineUpdateInput = {
  _id: Scalars['ObjectID'];
  type: LineTypeEnum;
  label: Scalars['String'];
  group: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  content: ClearWalletLineInput;
};

export type ClearWalletLine = {
  __typename?: 'ClearWalletLine';
  text?: Maybe<Scalars['String']>;
  cardType?: Maybe<Scalars['String']>;
  nameOnCard?: Maybe<Scalars['String']>;
  cardNumber?: Maybe<Scalars['String']>;
  cvv?: Maybe<Scalars['String']>;
  expiry?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  siteUrl?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type ClearWalletLineInput = {
  text?: Maybe<Scalars['String']>;
  cardType?: Maybe<Scalars['String']>;
  nameOnCard?: Maybe<Scalars['String']>;
  cardNumber?: Maybe<Scalars['String']>;
  cvv?: Maybe<Scalars['String']>;
  expiry?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  siteUrl?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

/** Result of the connection */
export type ConnectionInformation = {
  __typename?: 'ConnectionInformation';
  /** Token to be used in connection information */
  token: Scalars['String'];
  /** The connected user */
  user: User;
};

/** Information needed to connect to the server and retreive object from database. */
export type ConnectionInformationInput = {
  /** Login of the user */
  username: Scalars['String'];
  /** Password used for connection */
  password: Scalars['String'];
};

export type CreateSessionResult = ConnectionInformation | Errors;

/** Master key encrypted for the user */
export type EncryptedBlock = {
  __typename?: 'EncryptedBlock';
  /** Salt added to encrypt the master key */
  salt: Scalars['Buffer'];
  /** Initialization Vector */
  iv?: Maybe<Scalars['Buffer']>;
  /** Content encrypted with salt */
  content: Scalars['Buffer'];
  /** Authentification tag */
  authTag: Scalars['Buffer'];
};

/** Master key encrypted for the user */
export type EncryptedBlockInput = {
  /** Salt added to encrypt the master key */
  salt: Scalars['Buffer'];
  /** Initialization Vector */
  iv: Scalars['Buffer'];
  /** Content encrypted with salt */
  content: Scalars['Buffer'];
  /** Authentification tag */
  authTag: Scalars['Buffer'];
};

/** Information about an error */
export type Error = {
  __typename?: 'Error';
  /** Name of the field */
  fieldName?: Maybe<Scalars['String']>;
  /** Error message */
  message?: Maybe<Scalars['String']>;
};

/** List of errors */
export type Errors = {
  __typename?: 'Errors';
  /** List of errors */
  errors: Array<Error>;
};

/** Type of line accepted in the wallet */
export enum LineTypeEnum {
  Card = 'card',
  Password = 'password',
  Text = 'text',
}

export type LocalSession = {
  __typename?: 'LocalSession';
  /** The username connected on the computer */
  username?: Maybe<Scalars['String']>;
  /** The decrypted master key, that is used to decrypt all objects */
  masterKey?: Maybe<Scalars['String']>;
  /** Authentification token used with the server to ensure that the connection is open */
  authentificationToken?: Maybe<Scalars['String']>;
};

export type MenuItem = {
  __typename?: 'MenuItem';
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  router?: Maybe<Scalars['String']>;
};

export type MenuItemInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  router?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Register a new user */
  registerUser: RegisterUserResult;
  /** Create a new session, return the authorization token */
  createSession: CreateSessionResult;
  /** Create or Update a WalletLine */
  createLine: UpdateLineResult;
  /** Create or Update a WalletLine */
  updateLine: UpdateLineResult;
  /** Remove the line */
  removeLine: Errors;
  defineToolbar?: Maybe<Scalars['Boolean']>;
  addMenu?: Maybe<Scalars['Boolean']>;
  addAction?: Maybe<Scalars['Boolean']>;
  /** Register a new session */
  registerSession?: Maybe<Scalars['Boolean']>;
  /** Encrypt and create a clear line */
  createClearLine: UpdateLineResult;
  /** Encrypt and update a clear line */
  updateClearLine: UpdateLineResult;
};

export type MutationRegisterUserArgs = {
  input: RegistrationUserInput;
};

export type MutationCreateSessionArgs = {
  input: ConnectionInformationInput;
};

export type MutationCreateLineArgs = {
  input: WalletLineCreateInput;
};

export type MutationUpdateLineArgs = {
  input: WalletLineUpdateInput;
};

export type MutationRemoveLineArgs = {
  id: Scalars['String'];
};

export type MutationDefineToolbarArgs = {
  input: ToolbarInput;
};

export type MutationAddMenuArgs = {
  input: MenuItemInput;
};

export type MutationAddActionArgs = {
  input: MenuItemInput;
};

export type MutationRegisterSessionArgs = {
  input: SessionInput;
};

export type MutationCreateClearLineArgs = {
  input: ClearLineCreateInput;
};

export type MutationUpdateClearLineArgs = {
  input: ClearLineUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  /** Request a user */
  user: User;
  /** Request the current session */
  session: User;
  /** Request the list of lines from the connected users. */
  lines: Array<WalletLine>;
  /** Request a wallet line */
  line: WalletLine;
  /** Request all groups available on lines */
  groups: Array<Scalars['String']>;
  /** Request all transactions that happen since the last synchronisation date. */
  transactions: Array<WalletTransaction>;
  toolbar?: Maybe<Toolbar>;
  /** Indicate if there is a persisted local state */
  localState: Scalars['Boolean'];
  /** Session of the user */
  localSession: LocalSession;
};

export type QueryUserArgs = {
  id: Scalars['String'];
};

export type QueryLineArgs = {
  id: Scalars['String'];
};

export type QueryTransactionsArgs = {
  earliest: Scalars['Date'];
};

/** Result of registered user */
export type RegisterUserResult = User | Errors;

/** Input used to register a new user */
export type RegistrationUserInput = {
  /** Login of the user */
  _id: Scalars['ID'];
  /** Password used for registration */
  password: Scalars['String'];
  /** Encrypted master key */
  encryption: EncryptedBlockInput;
};

export type SessionInput = {
  /** The username */
  username: Scalars['String'];
  /** The authentification token */
  authentificationToken: Scalars['String'];
  /** The master key */
  masterKey: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Stream of update to wallet line */
  transactionAdded: WalletTransaction;
};

export type Toolbar = {
  __typename?: 'Toolbar';
  title?: Maybe<Scalars['String']>;
  searchEnabled?: Maybe<Scalars['Boolean']>;
  actions: Array<Maybe<MenuItem>>;
  menu: Array<Maybe<MenuItem>>;
};

export type ToolbarInput = {
  title?: Maybe<Scalars['String']>;
  searchEnabled?: Maybe<Scalars['Boolean']>;
  actions?: Maybe<Array<Maybe<MenuItemInput>>>;
  menu?: Maybe<Array<Maybe<MenuItemInput>>>;
};

/** Type of transaction */
export enum TransactionTypeEnum {
  Line = 'line',
}

/** Result of creation or update of the line */
export type UpdateLineResult = WalletLine | Errors;

/** User defined in the application */
export type User = {
  __typename?: 'User';
  /** Login of the user */
  _id: Scalars['ID'];
  /** Encrypted master key */
  encryption: EncryptedBlock;
  /** Creation date of the user */
  createdAt?: Maybe<Scalars['Date']>;
  /** Wallet lines of the user. */
  lines?: Maybe<Array<WalletLine>>;
};

/** Wallet */
export type WalletLine = {
  __typename?: 'WalletLine';
  /** Id of the line */
  _id: Scalars['ObjectID'];
  /** Type of the line (text, password, card) */
  type: LineTypeEnum;
  /** Label of the wallet line */
  label: Scalars['String'];
  /** Group of the wallet line */
  group?: Maybe<Scalars['String']>;
  /** Logo of the line */
  logo?: Maybe<Scalars['Buffer']>;
  /** Encrypted content of the line (encrypted client side) */
  encryption: EncryptedBlock;
  /** Created date of the line */
  createdAt?: Maybe<Scalars['Date']>;
  /** Last updated date of the line */
  updatedAt?: Maybe<Scalars['Date']>;
  /** Revision (modification count) of the line */
  _rev: Scalars['Int'];
  /** Owner of the list */
  user: User;
  content: ClearWalletLine;
  typeLabel: Scalars['String'];
  typeColor: Scalars['String'];
  typeIcon: Scalars['String'];
};

/** Wallet line used for creation */
export type WalletLineCreateInput = {
  /** Type of the line (text, password, card) */
  type: LineTypeEnum;
  /** Label of the wallet line */
  label: Scalars['String'];
  /** Group of the wallet line */
  group: Scalars['String'];
  /** Logo of the line */
  logo?: Maybe<Scalars['String']>;
  /** Encrypted content of the line (encrypted client side) */
  encryption: EncryptedBlockInput;
};

/** Wallet line used for update */
export type WalletLineUpdateInput = {
  /** Id of the line, if not filled application create a new line */
  _id?: Maybe<Scalars['ObjectID']>;
  /** Type of the line (text, password, card) */
  type?: Maybe<LineTypeEnum>;
  /** Label of the wallet line */
  label?: Maybe<Scalars['String']>;
  /** Group of the wallet line */
  group?: Maybe<Scalars['String']>;
  /** Logo of the line */
  logo?: Maybe<Scalars['String']>;
  /** Encrypted content of the line (encrypted client side) */
  encryption?: Maybe<EncryptedBlockInput>;
};

/** Wallet transaction, used to synchronize lines between devices */
export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  /** Id of the transaction */
  _id: Scalars['ObjectID'];
  /** Type of the object modified (only line) */
  type: TransactionTypeEnum;
  /** The line before the modification */
  before?: Maybe<WalletLine>;
  /** The line after the modification */
  after?: Maybe<WalletLine>;
  /** The modification date */
  updatedAt: Scalars['Date'];
  /** A SHA-512 calculate on the modification. */
  sha512: Scalars['String'];
  /** Owner of the transaction */
  user: User;
  /** Request a wallet line */
  line: WalletLine;
};
export type CreateClearLineMutationVariables = {
  input: ClearLineCreateInput;
};

export type CreateClearLineMutation = { __typename?: 'Mutation' } & {
  createClearLine:
    | ({ __typename?: 'WalletLine' } & LineFragmentFragment)
    | ({ __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> });
};

export type CreateLineMutationVariables = {
  input: WalletLineCreateInput;
};

export type CreateLineMutation = { __typename?: 'Mutation' } & {
  createLine:
    | ({ __typename?: 'WalletLine' } & LineFragmentFragment)
    | ({ __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> });
};

export type GetGroupQueryVariables = {};

export type GetGroupQuery = { __typename?: 'Query' } & Pick<Query, 'groups'>;

export type LineFragmentFragment = { __typename?: 'WalletLine' } & Pick<
  WalletLine,
  '_id' | '_rev' | 'type' | 'typeLabel' | 'typeColor' | 'typeIcon' | 'label' | 'group' | 'logo'
> & {
    encryption: { __typename?: 'EncryptedBlock' } & Pick<EncryptedBlock, 'salt' | 'iv' | 'content' | 'authTag'>;
    content: { __typename?: 'ClearWalletLine' } & Pick<
      ClearWalletLine,
      'text' | 'cardType' | 'nameOnCard' | 'cardNumber' | 'cvv' | 'expiry' | 'code' | 'username' | 'password' | 'siteUrl' | 'notes'
    >;
  };

export type GetLineQueryVariables = {
  id: Scalars['String'];
};

export type GetLineQuery = { __typename?: 'Query' } & { line: { __typename?: 'WalletLine' } & LineFragmentFragment };

export type GetLinesQueryVariables = {};

export type GetLinesQuery = { __typename?: 'Query' } & { lines: Array<{ __typename?: 'WalletLine' } & LineFragmentFragment> };

export type RemoveLineMutationVariables = {
  id: Scalars['String'];
};

export type RemoveLineMutation = { __typename?: 'Mutation' } & {
  removeLine: { __typename: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> };
};

export type UpdateClearLineMutationVariables = {
  input: ClearLineUpdateInput;
};

export type UpdateClearLineMutation = { __typename?: 'Mutation' } & {
  updateClearLine:
    | ({ __typename?: 'WalletLine' } & LineFragmentFragment)
    | ({ __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> });
};

export type UpdateLineMutationVariables = {
  input: WalletLineUpdateInput;
};

export type UpdateLineMutation = { __typename?: 'Mutation' } & {
  updateLine:
    | ({ __typename?: 'WalletLine' } & LineFragmentFragment)
    | ({ __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> });
};

export type CheckSessionQueryVariables = {};

export type CheckSessionQuery = { __typename?: 'Query' } & Pick<Query, 'localState'> & {
    localSession: { __typename?: 'LocalSession' } & Pick<LocalSession, 'username'>;
  };

export type GetLocalSessionQueryVariables = {};

export type GetLocalSessionQuery = { __typename?: 'Query' } & {
  localSession: { __typename?: 'LocalSession' } & Pick<LocalSession, 'username' | 'authentificationToken' | 'masterKey'>;
};

export type RegisterSessionMutationVariables = {
  input: SessionInput;
};

export type RegisterSessionMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'registerSession'>;

export type AddActionMutationVariables = {
  input: MenuItemInput;
};

export type AddActionMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'addAction'>;

export type AddMenuMutationVariables = {
  input: MenuItemInput;
};

export type AddMenuMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'addMenu'>;

export type DefineToolbarMutationVariables = {
  input: ToolbarInput;
};

export type DefineToolbarMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'defineToolbar'>;

export type GetToolbarQueryVariables = {};

export type GetToolbarQuery = { __typename?: 'Query' } & {
  toolbar: Maybe<
    { __typename?: 'Toolbar' } & Pick<Toolbar, 'title' | 'searchEnabled'> & {
        actions: Array<Maybe<{ __typename?: 'MenuItem' } & Pick<MenuItem, 'id' | 'title' | 'router'>>>;
        menu: Array<Maybe<{ __typename?: 'MenuItem' } & Pick<MenuItem, 'id' | 'title' | 'router'>>>;
      }
  >;
};

export type CreateSessionMutationVariables = {
  input: ConnectionInformationInput;
};

export type CreateSessionMutation = { __typename?: 'Mutation' } & {
  createSession:
    | ({ __typename?: 'ConnectionInformation' } & Pick<ConnectionInformation, 'token'> & {
          user: { __typename?: 'User' } & Pick<User, '_id'> & {
              encryption: { __typename?: 'EncryptedBlock' } & Pick<EncryptedBlock, 'salt' | 'iv' | 'content' | 'authTag'>;
            };
        })
    | ({ __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> });
};

export type RegisterUserMutationVariables = {
  input: RegistrationUserInput;
};

export type RegisterUserMutation = { __typename?: 'Mutation' } & {
  registerUser: { __typename?: 'Errors' } & { errors: Array<{ __typename?: 'Error' } & Pick<Error, 'fieldName' | 'message'>> };
};
