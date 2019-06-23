import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
  DefineToolbarMutation,
  DefineToolbarMutationVariables,
  ToolbarInput,
  MenuItemInput,
  AddActionMutationVariables,
  AddActionMutation,
  AddMenuMutation,
  AddMenuMutationVariables,
} from '@/generated/graphql';
import defineToolbarMutation from './graphql/toolbar/defineToolbar.graphql';
import addActionMutation from './graphql/toolbar/addAction.graphql';
import addMenuMutation from './graphql/toolbar/addMenu.graphql';

export async function defineToolbar<TCacheShape = NormalizedCacheObject>($apollo: ApolloClient<TCacheShape>, toolbar: ToolbarInput) {
  await $apollo.mutate<DefineToolbarMutation, DefineToolbarMutationVariables>({
    mutation: defineToolbarMutation,
    variables: { input: toolbar },
  });
}

export async function addAction<TCacheShape = NormalizedCacheObject>($apollo: ApolloClient<TCacheShape>, item: MenuItemInput) {
  await $apollo.mutate<AddActionMutation, AddActionMutationVariables>({
    mutation: addActionMutation,
    variables: { input: item },
  });
}

export async function addMenu<TCacheShape = NormalizedCacheObject>($apollo: ApolloClient<TCacheShape>, item: MenuItemInput) {
  await $apollo.mutate<AddMenuMutation, AddMenuMutationVariables>({
    mutation: addMenuMutation,
    variables: { input: item },
  });
}
