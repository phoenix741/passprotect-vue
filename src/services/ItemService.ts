import apolloProvider from '../plugins/vue-apollo';
import {
  ClearLineUpdateInput,
  UpdateClearLineMutation,
  UpdateClearLineMutationVariables,
  ClearLineCreateInput,
  CreateClearLineMutationVariables,
  CreateClearLineMutation,
  GetLinesQuery,
  GetLinesQueryVariables,
  RemoveLineMutation,
  RemoveLineMutationVariables,
  LineFragmentFragment,
} from '@/generated/graphql';
import linesQuery from '@/services/graphql/lines/lines.graphql';
import groupQuery from '@/services/graphql/lines/group.graphql';
import createClearLineQuery from '@/services/graphql/lines/createClearLine.graphql';
import updateClearLineQuery from '@/services/graphql/lines/updateClearLine.graphql';
import removeLineQuery from '@/services/graphql/lines/removeLine.graphql';
import { pick } from '@/utils/lodash';

export async function exportLinesAsCsv() {
  const json2csv = import('json2csv');
  const downloadAsFile = import('downloadjs');

  const data = await exportLines();
  const csv = (await json2csv).parse(data);

  const download = (await downloadAsFile).default;

  return download(csv, 'password.csv', 'text/csv');
}

export async function exportLines() {
  const {
    data: { lines },
  } = await apolloProvider.defaultClient.query<GetLinesQuery, GetLinesQueryVariables>({ query: linesQuery });

  const result = [];
  for await (const line of lines) {
    result.push(
      Object.assign(
        {},
        pick(line, ['label']),
        pick(line.content, ['username', 'password', 'siteUrl', 'notes']),
        pick(line.content, ['cardType', 'nameOnCard', 'cardNumber', 'cvv', 'expiry', 'code', 'notes']),
        pick(line.content, ['text', 'notes']),
      ),
    );
  }
  return result;
}

export async function updateClearLine(input: ClearLineUpdateInput) {
  const result = await apolloProvider.defaultClient.mutate<UpdateClearLineMutation, UpdateClearLineMutationVariables>({
    mutation: updateClearLineQuery,
    variables: { input },
  });

  if (result.data && result.data.updateClearLine) {
    return result.data.updateClearLine;
  }

  throw new Error("Can't save the line on the server");
}

export async function createClearLine(input: ClearLineCreateInput) {
  const result = await apolloProvider.defaultClient.mutate<CreateClearLineMutation, CreateClearLineMutationVariables>({
    mutation: createClearLineQuery,
    variables: { input },
  });

  if (result.data && result.data.createClearLine) {
    return result.data.createClearLine;
  }

  throw new Error("Can't create the line on the server");
}

export async function removeLine(line: LineFragmentFragment) {
  const result = await apolloProvider.defaultClient.mutate<RemoveLineMutation, RemoveLineMutationVariables>({
    mutation: removeLineQuery,
    variables: { id: line._id },
    refetchQueries: [{ query: linesQuery }, { query: groupQuery }],
    awaitRefetchQueries: true,
  });

  if (result.data && result.data.removeLine) {
    return result.data.removeLine;
  }

  throw new Error("Can't remove the line on the server");
}
