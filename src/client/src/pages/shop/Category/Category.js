import React from 'react';
import PropTypes from 'prop-types';
import { NetworkStatus } from 'apollo-client';
import { Toggle } from 'react-powerplug';
import { H1, H3, GridLayout, Box, FlexLayout, Divider, Button } from '@deity/falcon-ui';
import {
  SearchConsumer,
  CategoryProductsQuery,
  CategoryLayout,
  CategoryArea,
  ShowingOutOf,
  SortOrdersProvider,
  SortOrderDropdown,
  getFiltersData,
  FiltersSummary,
  ProductList,
  ShowMore,
  Responsive,
  Sidebar,
  Loader
} from '@deity/falcon-ecommerce-uikit';
import { Filters } from './Filters';

const copy = item => item && JSON.parse(JSON.stringify(item));

const CategoryPage = ({ id }) => (
  <SearchConsumer>
    {({ state }) => (
      <CategoryProductsQuery
        variables={{
          categoryId: id,
          sort: state.sort,
          filters: copy(state.filters)
        }}
        passLoading
      >
        {({ category, fetchMore, networkStatus, loading }) => {
          if (!category && loading) {
            return <Loader />;
          }

          const { name, products } = category;
          const { pagination, items, aggregations } = products;
          const filtersData = getFiltersData(state.filters, aggregations);

          return (
            <CategoryLayout variant={!filtersData.length && 'noFilters'}>
              {loading && <Loader variant="overlay" />}
              <Box gridArea={CategoryArea.heading}>
                <H1>{name}</H1>
                <FlexLayout justifyContent="space-between" alignItems="center">
                  <ShowingOutOf itemsCount={items.length} totalItems={pagination.totalItems} />
                  <SortOrdersProvider>
                    {sortOrdersProps => <SortOrderDropdown {...sortOrdersProps} />}
                  </SortOrdersProvider>
                </FlexLayout>
                <Divider mt="xs" />
              </Box>
              {!!filtersData.length && (
                <Box gridArea={CategoryArea.filters}>
                  <Responsive width="md">
                    {matches =>
                      matches ? (
                        <Filters data={filtersData} />
                      ) : (
                        <Toggle initial={false}>
                          {({ on, toggle }) => (
                            <React.Fragment>
                              <Button onClick={toggle}>Filters</Button>
                              <Sidebar isOpen={on} side="left" close={toggle}>
                                <GridLayout gridRowGap="md">
                                  <H3 ml="xl">Filters</H3>
                                  <Filters data={filtersData} px="md" />
                                </GridLayout>
                              </Sidebar>
                            </React.Fragment>
                          )}
                        </Toggle>
                      )
                    }
                  </Responsive>
                </Box>
              )}
              <Box gridArea={CategoryArea.content}>
                <FiltersSummary data={filtersData} />
                <ProductList products={items} />
              </Box>
              <FlexLayout gridArea={CategoryArea.footer} flexDirection="column" alignItems="center">
                {pagination.nextPage && <Divider />}
                {pagination.nextPage && (
                  <ShowMore onClick={fetchMore} loading={networkStatus === NetworkStatus.fetchMore} />
                )}
              </FlexLayout>
            </CategoryLayout>
          );
        }}
      </CategoryProductsQuery>
    )}
  </SearchConsumer>
);

CategoryPage.propTypes = {
  id: PropTypes.string.isRequired
};

export default CategoryPage;
