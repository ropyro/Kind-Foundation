import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { H1, GridLayout, Button, FlexLayout } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { OrderListQuery, OrderList, NoOrders } from '@deity/falcon-ecommerce-uikit';

const Orders = () => (
  <GridLayout mb="md" gridGap="md">
    <H1>
      <T id="orderList.title" />
    </H1>
    <OrderListQuery>
      {({ orders: { items, pagination }, fetchMore, networkStatus }) =>
        items.length ? (
          <React.Fragment>
            <OrderList items={items} />
            {pagination.nextPage && (
              <FlexLayout justifyContent="center">
                <Button
                  onClick={fetchMore}
                  variant={networkStatus === NetworkStatus.fetchMore ? 'loader' : 'secondary'}
                  height="xl"
                >
                  <T id="orderList.showMore" />
                </Button>
              </FlexLayout>
            )}
          </React.Fragment>
        ) : (
          <NoOrders />
        )
      }
    </OrderListQuery>
  </GridLayout>
);

export default Orders;
