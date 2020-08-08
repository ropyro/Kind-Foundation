import React from 'react';
import PropTypes from 'prop-types';
import { Box, NumberInput, Button, Icon } from '@deity/falcon-ui';

export const RemoveItemButton = ({ onClick, loading }) => (
  <Button
    onClick={() => onClick()}
    disabled={loading}
    p="none"
    bg="transparent"
    css={{
      ':hover:enabled': {
        backgroundColor: 'transparent'
      }
    }}
  >
    <Icon
      src={loading ? 'loader' : 'trash'}
      size="md"
      stroke="secondaryText"
      css={({ theme }) => ({
        ':hover': {
          stroke: theme.colors.primary
        }
      })}
    />
  </Button>
);

RemoveItemButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool
};

export const ChangeItemNumberInput = ({ onChange, loading, ...props }) => (
  <Box position="relative">
    <Box css={{ opacity: loading ? 0.4 : 1 }}>
      <NumberInput readOnly={false} disabled={loading} min="1" name="qty" onChange={ev => onChange(ev)} {...props} />
    </Box>
    {loading && (
      <Icon
        src="loader"
        position="absolute"
        size="md"
        css={{
          // center the icon in the container
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    )}
  </Box>
);

ChangeItemNumberInput.propTypes = {
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  ...NumberInput.propTypes
};
