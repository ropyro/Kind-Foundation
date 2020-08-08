import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem } from '@deity/falcon-ui';
import { addressToString } from '@deity/falcon-ecommerce-uikit';

const AddressPicker = ({ addresses, selectedAddressId, onChange }) => {
  const selected = addresses.find(item => item.id === selectedAddressId);

  return (
    <Dropdown key={selectedAddressId || 'none'} onChange={onChange}>
      <DropdownLabel>{selected ? addressToString(selected) : 'Other'}</DropdownLabel>
      <DropdownMenu>
        {addresses.map(item => (
          <DropdownMenuItem value={item.id} key={item.id}>
            {addressToString(item)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem value={-1}>Other</DropdownMenuItem>
      </DropdownMenu>
    </Dropdown>
  );
};

AddressPicker.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({})),
  selectedAddressId: PropTypes.number,
  onChange: PropTypes.func
};

export default AddressPicker;
