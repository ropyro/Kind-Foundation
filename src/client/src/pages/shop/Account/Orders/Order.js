import React from 'react';
import { H1, Text, Divider, Box, FlexLayout, GridLayout } from '@deity/falcon-ui';
import { I18n, T } from '@deity/falcon-i18n';
import {
  GetOrderQuery,
  toGridTemplate,
  AddressDetails,
  DateFormat,
  TotalRow,
  LocaleProvider,
  OrderItemSummary
} from '@deity/falcon-ecommerce-uikit';

const orderLayoutArea = {
  items: 'checkout',
  summary: 'cart',
  divider: 'divider'
};

const orderLayout = {
  orderLayout: {
    display: 'grid',
    gridGap: 'lg',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'],
        [orderLayoutArea.items],
        [orderLayoutArea.divider],
        [orderLayoutArea.summary]
      ]),
      md: toGridTemplate([
        ['2fr', '1px', '1fr'],
        [orderLayoutArea.items, orderLayoutArea.divider, orderLayoutArea.summary]
      ])
    }
  }
};

const Order = ({ match }) => {
  const id = parseInt(match.params.id, 10);

  return (
    <GetOrderQuery variables={{ id }}>
      {({ order }) => (
        <GridLayout mb="md" gridGap="md">
          <H1>
            <T id="order.title" orderId={order.incrementId} />
          </H1>
          <FlexLayout>
            <Text fontWeight="bold" mr="md">
              <T id="order.statusLabel" />
            </Text>
            <T id="order.status" context={order.status || 'na'} />
          </FlexLayout>
          <Box defaultTheme={orderLayout}>
            <GridLayout gridArea={orderLayoutArea.items} alignContent="flex-start">
              <I18n>
                {t => (
                  <LocaleProvider currency={order.orderCurrencyCode}>
                    <Divider />
                    {order.items.map(x => (
                      <React.Fragment key={x.sku}>
                        <OrderItemSummary {...x} />
                        <Divider />
                      </React.Fragment>
                    ))}

                    <Box>
                      <TotalRow title={t('order.subtotalLabel')} value={order.subtotal} />
                      <TotalRow title={t('order.shippingAmountLabel')} value={order.shippingAmount} />
                    </Box>
                    <Divider />
                    <TotalRow title={t('order.grandTotalLabel')} value={order.grandTotal} fontWeight="bold" />
                  </LocaleProvider>
                )}
              </I18n>
            </GridLayout>
            <Divider gridArea={orderLayoutArea.divider} />
            <GridLayout gridArea={orderLayoutArea.summary} alignContent="flex-start">
              <Box>
                <Text fontWeight="bold">
                  <T id="order.billingAddressLabel" />
                </Text>
                <AddressDetails {...order.billingAddress} />
              </Box>
              <Box>
                <Text fontWeight="bold">
                  <T id="order.shippingAddressLabel" />
                </Text>
                <AddressDetails {...order.shippingAddress} />
              </Box>
              <Box>
                <Text fontWeight="bold">
                  <T id="order.createdAtLabel" />
                </Text>
                <DateFormat value={order.createdAt} />
              </Box>
              <Box>
                <Text fontWeight="bold">
                  <T id="order.shippingMethodLabel" />
                </Text>
                {order.shippingDescription}
              </Box>
              <Box>
                <Text fontWeight="bold">
                  <T id="order.paymentMethodLabel" />
                </Text>
                {order.shippingDescription}
              </Box>
            </GridLayout>
          </Box>
        </GridLayout>
      )}
    </GetOrderQuery>
  );
};

export default Order;
