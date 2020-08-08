import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { Box, H1, H2, Text, Link, Divider, FlexLayout, GridLayout } from '@deity/falcon-ui';
import { CustomerQuery, OrderListQuery, NoOrders, OrderList } from '@deity/falcon-ecommerce-uikit';

const Dashboard = () => (
  <GridLayout mb="md" gridGap="md">
    <H1>
      <T id="dashboard.title" />
    </H1>
    <Box>
      <OrderListQuery variables={{ pagination: { perPage: 1, page: 1 } }}>
        {({ orders: { items } }) => (
          <React.Fragment>
            <FlexLayout justifyContent="flex-start" alignItems="baseline">
              <H2>
                <T id="dashboard.recentOrder" />
              </H2>
              {!!items.length && (
                <Link as={RouterLink} to="/account/orders" ml="md">
                  <T id="dashboard.viewAllOrders" />
                </Link>
              )}
            </FlexLayout>
            <Box>{items.length ? <OrderList items={items} /> : <NoOrders />}</Box>
          </React.Fragment>
        )}
      </OrderListQuery>
    </Box>
    <Box>
      <FlexLayout justifyContent="flex-start" alignItems="baseline">
        <H2>
          <T id="dashboard.addressBook" />
        </H2>
        <Link as={RouterLink} to="/account/address-book" ml="md">
          <T id="dashboard.manageAddresses" />
        </Link>
      </FlexLayout>
    </Box>
    <Box>
      <H2>
        <T id="dashboard.personalInformation" />
      </H2>
      <CustomerQuery>
        {({ customer }) => (
          <React.Fragment>
            <Text>{`${customer.firstname} ${customer.lastname}`}</Text>
            <Text>{customer.email}</Text>
            <FlexLayout flexDirection="row" mt="xs">
              <Link as={RouterLink} to="/account/personal-information">
                <T id="dashboard.editCustomerLink" />
              </Link>
              <Divider variant="horizontal" mx="xs" />
              <Link as={RouterLink} to="/account/change-password">
                <T id="dashboard.changePasswordLink" />
              </Link>
            </FlexLayout>
          </React.Fragment>
        )}
      </CustomerQuery>
    </Box>
  </GridLayout>
);

export default Dashboard;
