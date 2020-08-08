import React from 'react';
import PropTypes from 'prop-types';
import { TotalRow } from '@deity/falcon-ecommerce-uikit';
import { Box, Divider } from '@deity/falcon-ui';

const TOTALS = {
  SHIPPING: 'shipping',
  SUBTOTAL: 'subtotal',
  GRAND_TOTAL: 'grand_total',
  DISCOUNT: 'discount'
};

// helper that returns particular total by its code
const getTotalByCode = (totals, code) => totals.find(total => total.code === code);

const CartTotals = ({ totalsData, totalsToDisplay = [], bold = [], ...props }) => (
  <Box {...props}>
    {totalsToDisplay.map((totalCode, index) => {
      if (totalCode === 'divider') {
        return <Divider key={`divider-${index}`} />; // eslint-disable-line react/no-array-index-key
      }

      const total = getTotalByCode(totalsData, totalCode);
      if (total) {
        return <TotalRow key={totalCode} {...total} fontWeight={bold.indexOf(totalCode) !== -1 ? 'bold' : 'normal'} />;
      }

      return null;
    })}
  </Box>
);

CartTotals.propTypes = {
  totalsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.number
    })
  ),
  totalsToDisplay: PropTypes.arrayOf(PropTypes.string),
  bold: PropTypes.arrayOf(PropTypes.string)
};

CartTotals.TOTALS = TOTALS;

export default CartTotals;
