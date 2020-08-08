import React from 'react';
import PropTypes from 'prop-types';
import { Box, Image, Text, Divider } from '@deity/falcon-ui';
import { Price, toGridTemplate } from '@deity/falcon-ecommerce-uikit';
import CartTotals from '../components/CartTotals';

const MAX_THUMB_SIZE = '80px';

const ItemArea = {
  thumb: 'thumb',
  name: 'name',
  price: 'price',
  details: 'details'
};

export const checkoutCartSummaryItemLayout = {
  checkoutCartSummaryItemLayout: {
    display: 'grid',
    gridGap: 'sm',
    my: 'xs',
    fontSize: 'xs',
    // prettier-ignore
    gridTemplate:  toGridTemplate([
      [MAX_THUMB_SIZE,  '1fr',            '60px',           '60px'            ],
      [ItemArea.thumb,  ItemArea.name,    ItemArea.name,    ItemArea.price    ],
      [ItemArea.thumb,  ItemArea.details, ItemArea.details, ItemArea.details  ]
    ])
  }
};

const CartItem = ({ item }) => (
  <Box defaultTheme={checkoutCartSummaryItemLayout}>
    <Image
      gridArea={ItemArea.thumb}
      mr="lg"
      src={item.thumbnailUrl}
      css={{ maxWidth: MAX_THUMB_SIZE, maxHeight: MAX_THUMB_SIZE }}
    />
    <Text gridArea={ItemArea.name} fontWeight="bold">
      {item.name}
    </Text>
    <Box gridArea={ItemArea.details}>
      {item.itemOptions &&
        item.itemOptions.length > 0 &&
        item.itemOptions.map(option => <OptionRow option={option} key={option.label} />)}
      <OptionRow option={{ label: 'Quantity', value: item.qty }} />
    </Box>
    <Price gridArea={ItemArea.price} value={item.rowTotalInclTax} fontWeight="bold" css={{ textAlign: 'right' }} />
  </Box>
);

const OptionRow = ({ option }) => (
  <Box display="flex" fontSize="xs">
    <Text flex="1">{option.label}:</Text>
    <Text flex="2">{option.value}</Text>
  </Box>
);
OptionRow.propTypes = {
  option: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

const CheckoutCartSummary = ({ cart }) => (
  <Box>
    {cart.items.map(item => (
      <React.Fragment key={item.sku}>
        <CartItem item={item} />
        <Divider my="sm" />
      </React.Fragment>
    ))}
    <CartTotals
      totalsData={cart.totals}
      totalsToDisplay={[
        CartTotals.TOTALS.SUBTOTAL,
        CartTotals.TOTALS.SHIPPING,
        CartTotals.TOTALS.DISCOUNT,
        'divider',
        CartTotals.TOTALS.GRAND_TOTAL
      ]}
      bold={[CartTotals.TOTALS.GRAND_TOTAL]}
      css={({ theme }) => ({
        '> hr': {
          marginTop: theme.spacing.xs,
          marginBottom: theme.spacing.xs
        }
      })}
    />
  </Box>
);

CheckoutCartSummary.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
    totals: PropTypes.arrayOf(PropTypes.shape({}))
  })
};

export default CheckoutCartSummary;
