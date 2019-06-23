export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}

const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'RegisterUserResult',
        possibleTypes: [
          {
            name: 'User',
          },
          {
            name: 'Errors',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'CreateSessionResult',
        possibleTypes: [
          {
            name: 'ConnectionInformation',
          },
          {
            name: 'Errors',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'UpdateLineResult',
        possibleTypes: [
          {
            name: 'WalletLine',
          },
          {
            name: 'Errors',
          },
        ],
      },
    ],
  },
};

export default result;
