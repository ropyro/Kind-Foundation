import React from 'react';
import { ResetPassword } from '@deity/falcon-ecommerce-uikit';

export default ({ location }) => {
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('token') || '';

  return <ResetPassword resetToken={resetToken} />;
};
