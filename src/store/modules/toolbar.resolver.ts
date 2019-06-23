import { MutationDefineToolbarArgs, Maybe, MenuItemInput, MenuItem, MutationAddMenuArgs, MutationAddActionArgs } from '@/generated/graphql';
import toolbarQuery from '@/services/graphql/toolbar/toolbar.graphql';

export const resolver = {
  Mutation: {
    defineToolbar: (_: any, { input }: MutationDefineToolbarArgs, { cache }: any) => {
      const toolbar = {
        __typename: 'Toolbar',
        ...input,
        actions: createMenuItems(input.actions),
        menu: createMenuItems(input.menu),
      };
      cache.writeQuery({ query: toolbarQuery, data: { toolbar } });
      return true;
    },
    addMenu(_: any, { input }: MutationAddMenuArgs, { cache }: any) {
      const data = cache.readQuery({ query: toolbarQuery });
      const toolbar = {
        ...data.toolbar,
        menu: [...data.toolbar.menu, createMenuItem(input)],
      };
      cache.writeQuery({ query: toolbarQuery, data: { toolbar } });
      return true;
    },
    addAction(_: any, { input }: MutationAddActionArgs, { cache }: any) {
      const data = cache.readQuery({ query: toolbarQuery });
      const toolbar = {
        ...data.toolbar,
        actions: [...data.toolbar.actions, createMenuItem(input)],
      };
      cache.writeQuery({ query: toolbarQuery, data: { toolbar } });
      return true;
    },
  },
};

export const initialStore = {
  toolbar: {
    __typename: 'Toolbar',
    title: '',
    searchEnabled: false,
    actions: [],
    menu: [],
  },
};

function createMenuItems(items?: Maybe<Array<Maybe<MenuItemInput>>>): Maybe<MenuItem>[] {
  return (items && items.map(item => createMenuItem(item))) || [];
}

function createMenuItem(menu: Maybe<MenuItemInput>): Maybe<MenuItem> {
  return (
    menu && {
      __typename: 'MenuItem',
      id: menu.id,
      title: menu.title || null,
      router: menu.router || null,
    }
  );
}
