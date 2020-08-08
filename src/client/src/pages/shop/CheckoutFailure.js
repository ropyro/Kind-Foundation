import React from 'react';
import { Box, H1, Text, themed } from '@deity/falcon-ui';

const CheckoutFailureLayout = themed({
  tag: Box,
  defaultTheme: {
    checkoutFailureLayout: {
      flexLayout: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        my: 'xxl'
      }
    }
  }
});

const CheckoutFailure = () => (
  <CheckoutFailureLayout>
    <H1 mb="xl">Order failed</H1>
    <Text>Unfortunately we could not process your payment, try again later!</Text>
  </CheckoutFailureLayout>
);

export default CheckoutFailure;
