import React from 'react';
import gql from 'graphql-tag';
import { H1, GridLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { Query, ProductList } from '@deity/falcon-ecommerce-uikit';

const HOMEPAGE_PRODUCTS_QUERY = gql`
  query HomepageProducts($categoryId: String!, $amount: Int) {
    category(id: $categoryId) {
      products(pagination: { perPage: $amount, page: 1 }) {
        items {
          id
          name
          price {
            regular
            special
            minTier
          }
          thumbnail
          urlPath
        }
      }
    }
  }
`;

const Home = () => (

  <GridLayout gridGap="md" py="ld">
    <br></br>
    <Query query={HOMEPAGE_PRODUCTS_QUERY} variables={{ categoryId: 'computers', amount: 10 }}>
      {({ category }) => <ProductList products={category.products.items} />}
    </Query>
  </GridLayout>
);

export default Home;
