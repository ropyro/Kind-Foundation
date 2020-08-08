import { GET_SIDEBAR_STATE } from './pages/shop/components/Sidebar';
/**
 * Defines client-side state resolvers
 */

const sortOrders = [
  {
    name: 'Position',
    value: undefined,
    __typename: 'SortOrder'
  },
  {
    name: 'Price ascending',
    value: {
      field: 'price',
      direction: 'asc',
      __typename: 'SortOrderValue'
    },
    __typename: 'SortOrder'
  },
  {
    name: 'Price descending',
    value: {
      field: 'price',
      direction: 'desc',
      __typename: 'SortOrderValue'
    },
    __typename: 'SortOrder'
  },
  {
    name: 'Name ascending',
    value: {
      field: 'name',
      direction: 'asc',
      __typename: 'SortOrderValue'
    },
    __typename: 'SortOrder'
  },
  {
    name: 'Name descending',
    value: {
      field: 'name',
      direction: 'desc',
      __typename: 'SortOrderValue'
    },
    __typename: 'SortOrder'
  }
];

export default {
  data: {
    sidebar: {
      contentType: null,
      side: 'right',
      isOpen: false,
      __typename: 'SidebarStatus'
    }
  },

  resolvers: {
    Query: {
      sortOrders: () => sortOrders
    },

    Mutation: {
      openSidebar: (_, { contentType, side }, { cache }) => {
        const data = {
          sidebar: {
            contentType,
            side: side || 'right',
            isOpen: true,
            __typename: 'SidebarStatus'
          }
        };

        cache.writeQuery({ query: GET_SIDEBAR_STATE, data });

        return null;
      },

      closeSidebar: (_, _variables, { cache }) => {
        const queryResponse = cache.readQuery({ query: GET_SIDEBAR_STATE });
        const sidebar = { ...queryResponse.sidebar };
        sidebar.isOpen = false;

        cache.writeQuery({
          query: GET_SIDEBAR_STATE,
          data: { sidebar }
        });

        return null;
      }
    }
  }
};
