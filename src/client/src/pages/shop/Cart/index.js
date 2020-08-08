import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { CartQuery } from '@deity/falcon-ecommerce-uikit';
import { Box, H1, Text, Divider, Button } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';

const cartLayout = {
  cartLayout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  }
};

const CartItemList = ({ items }) => (
  <Box>
    {items.map(item => (
      <React.Fragment key={item.sku}>
        <CartItem item={item} />
        <Divider key={`d-${item.sku}`} />
      </React.Fragment>
    ))}
  </Box>
);
CartItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({}))
};

const CartPage = () => (
  <CartQuery>
    {({ cart }) => (
      <Box mt="xxl" defaultTheme={cartLayout}>
        <H1 fontSize="xl">
          <T id="cart.title" />
        </H1>
        {cart.items.length > 0 ? (
          <React.Fragment>
            <CartItemList items={cart.items} />
            <CartSummary totals={cart.totals} couponCode={cart.couponCode} />
            <Button as={RouterLink} to="/checkout" alignSelf="center" px="xxxl">
              <T id="cart.checkout" />
            </Button>
          </React.Fragment>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Text mt="lg">
              <T id="cart.emptyCart" />
            </Text>
            <Button mt="sm" as={RouterLink} to="/">
              <T id="cart.goShoppingButton" />
            </Button>
          </Box>
        )}
      </Box>
    )}
  </CartQuery>
);

export default CartPage;
