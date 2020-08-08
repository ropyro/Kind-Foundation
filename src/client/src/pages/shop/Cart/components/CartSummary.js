import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { adopt } from 'react-adopt';
import { ApplyCouponMutation, CancelCouponMutation, toGridTemplate } from '@deity/falcon-ecommerce-uikit';
import { Box, Input, Button, Text, Icon } from '@deity/falcon-ui';
import { I18n } from '@deity/falcon-i18n';
import CartTotals from '../../components/CartTotals';

export const CartSummaryArea = {
  coupon: 'coupon',
  totals: 'totals',
  divider: 'divider'
};

const cartSummaryLayout = {
  cartSummaryLayout: {
    display: 'grid',
    gridGap: {
      xs: 'sm',
      md: 'md'
    },
    my: 'lg',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'                    ],
        [CartSummaryArea.coupon   ], 
        [CartSummaryArea.divider  ], 
        [CartSummaryArea.totals   ]
      ]),
      md: toGridTemplate([
        ['1fr',                   '1px',                    '3fr'                 ],
        [CartSummaryArea.coupon,  CartSummaryArea.divider,  CartSummaryArea.totals]
      ])
    }
  }
};

const ApplyCouponForm = adopt({
  applyCouponMutation: ({ render }) => (
    <ApplyCouponMutation>{(applyCoupon, result) => render({ applyCoupon, result })}</ApplyCouponMutation>
  ),

  cancelCouponMutation: ({ render }) => (
    <CancelCouponMutation>{(cancelCoupon, result) => render({ cancelCoupon, result })}</CancelCouponMutation>
  ),

  formik: ({ couponCode, applyCouponMutation, cancelCouponMutation, validate, render }) => (
    <Formik
      initialValues={{ couponCode }}
      validate={validate}
      onSubmit={values => {
        if (!couponCode) {
          applyCouponMutation.applyCoupon({
            variables: {
              input: {
                ...values
              }
            }
          });
        } else {
          cancelCouponMutation.cancelCoupon();
        }
      }}
    >
      {(...props) => <Form>{render(...props)}</Form>}
    </Formik>
  )
});

const CartSummary = ({ totals, couponCode }) => (
  <I18n>
    {t => (
      <Box mt="md" defaultTheme={cartSummaryLayout}>
        <Box gridArea={CartSummaryArea.coupon}>
          <ApplyCouponForm
            couponCode={couponCode}
            validate={values => {
              if (!values.couponCode) {
                return { couponCode: t('cart.invalidCouponCode') };
              }
            }}
          >
            {({
              applyCouponMutation: { result: applyCouponResult },
              cancelCouponMutation: { result: cancelCouponResult },
              formik: { errors, handleChange, handleBlur, values }
            }) => {
              const errorMessage = !errors.couponCode && !!applyCouponResult.error && applyCouponResult.error.message;

              return (
                <Box display="flex" flexDirection="column" alignItems="stretch">
                  <Text>{t(`cart.couponCode`)}</Text>
                  <Input
                    my="xs"
                    type="text"
                    disabled={!!couponCode}
                    name="couponCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue={couponCode}
                  />
                  <Button
                    type="submit"
                    disabled={
                      applyCouponResult.loading || cancelCouponResult.loading || !values.couponCode || errors.couponCode
                    }
                    my="xs"
                  >
                    {(applyCouponResult.loading || cancelCouponResult.loading) && (
                      <Icon src="loader" size="md" mr="sm" fill="secondaryLight" />
                    )}
                    {couponCode ? t(`cart.cancelCouponCode`) : t(`cart.applyCouponCode`)}
                  </Button>
                  {errorMessage && (
                    <Text fontSize="xs" color="error">
                      {errorMessage}
                    </Text>
                  )}
                </Box>
              );
            }}
          </ApplyCouponForm>
        </Box>
        <Box
          gridArea={CartSummaryArea.divider}
          css={({ theme }) => ({
            ':after': {
              content: '" "',
              display: 'block',
              width: '100%',
              height: '100%',
              minWidth: '1px',
              minHeight: '1px',
              backgroundColor: theme.colors.secondaryDark
            }
          })}
        />
        <CartTotals
          gridArea={CartSummaryArea.totals}
          totalsData={totals}
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
    )}
  </I18n>
);

CartSummary.propTypes = {
  totals: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.number
    })
  ),
  couponCode: PropTypes.string
};

export default CartSummary;
