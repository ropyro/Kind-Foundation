import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { T, I18n } from '@deity/falcon-i18n';
import { H1, H2, Box, Link, Icon, Button, Divider, FlexLayout } from '@deity/falcon-ui';
import {
  AddressListQuery,
  AddressCardLayout,
  AddressDetails,
  AddressListLayout,
  getAddressType,
  RemoveAddressMutation
} from '@deity/falcon-ecommerce-uikit';

const AddressBook = () => (
  <Box>
    <H1>
      <T id="addressBook.title" />
    </H1>
    <AddressListQuery>
      {({ addresses: { items } }) => {
        const billing = items.find(x => x.defaultBilling);
        const shipping = items.find(x => x.defaultShipping);
        const rest = items.filter(x => !x.defaultBilling && !x.defaultShipping) || [];
        const anyDefaults = billing || shipping;
        const defaultsEqual = (billing && billing.id) === (shipping && shipping.id);
        const anyRest = rest.length > 0;

        return (
          <React.Fragment>
            {anyDefaults && (
              <AddressListLayout my="md">
                {defaultsEqual ? (
                  <DefaultAddressCard address={billing} />
                ) : (
                  <React.Fragment>
                    {billing && <DefaultAddressCard address={billing} />}
                    {shipping && <DefaultAddressCard address={shipping} />}
                  </React.Fragment>
                )}
              </AddressListLayout>
            )}
            {anyDefaults && anyRest && <Divider />}
            {anyRest && (
              <Box my="md">
                <H2>
                  <T id="addressBook.sectionTitle_other" />
                </H2>
                <AddressListLayout gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}>
                  {rest.map(x => (
                    <AddressCardLayout key={x.id}>
                      <AddressDetails {...x} />
                      <AddressActions addressId={x.id} />
                    </AddressCardLayout>
                  ))}
                </AddressListLayout>
              </Box>
            )}
            <FlexLayout flexDirection="column" alignItems="center" p="sm">
              <Button as={RouterLink} to="/account/address-book/add" flex={1}>
                <T id="addressBook.addNewButton" />
              </Button>
            </FlexLayout>
          </React.Fragment>
        );
      }}
    </AddressListQuery>
  </Box>
);

export default AddressBook;

const DefaultAddressCard = ({ address }) => (
  <AddressCardLayout>
    <H2>
      <T id="addressBook.sectionTitle" context={getAddressType(address)} />
    </H2>
    <AddressDetails {...address} />
    <AddressActions addressId={address.id} />
  </AddressCardLayout>
);

const AddressActions = ({ addressId }) => (
  <FlexLayout flexDirection="row" mt="xs">
    <EditAddressLink id={addressId} />
    <Divider variant="horizontal" mx="xs" />
    <RemoveAddressLink id={addressId} />
  </FlexLayout>
);

const EditAddressLink = ({ id }) => (
  <Link as={RouterLink} to={`/account/address-book/edit/${id}`}>
    <T id="addressBook.editButton" />
  </Link>
);

const RemoveAddressLink = ({ id }) => (
  <RemoveAddressMutation>
    {(removeAddress, { loading }) => (
      <I18n>
        {t => (
          <React.Fragment>
            <Link
              onClick={() => {
                if (window.confirm(t('addressBook.removeConfirmationMessage'))) {
                  removeAddress({ variables: { id } });
                }
              }}
            >
              {t('addressBook.removeButton')}
            </Link>
            {loading && <Icon ml="xs" src="loader" size="md" />}
          </React.Fragment>
        )}
      </I18n>
    )}
  </RemoveAddressMutation>
);
