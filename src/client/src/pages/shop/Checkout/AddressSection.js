import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FlexLayout, Checkbox, Label, Details, DetailsContent, Button } from '@deity/falcon-ui';
import { T } from '@deity/falcon-i18n';
import { AddressDetails } from '@deity/falcon-ecommerce-uikit';
import AddressForm from '../components/AddressForm';
import ErrorList from '../components/ErrorList';
import SectionHeader from './CheckoutSectionHeader';
import AddressPicker from './AddressPicker';

class AddressSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useTheSame: !!props.useTheSame,
      selectedAddressId: null
    };
  }

  submitAddress = ({ street1, street2, ...restValues }) => {
    this.props.setAddress({ ...restValues, street: [street1, street2] });
  };

  submitSelectedAddress = () => {
    const selectedAddressId = this.state.selectedAddressId || this.props.defaultSelected.id;
    const selectedAddress = this.props.availableAddresses.find(item => item.id === selectedAddressId);
    // make sure we don't send __typename field
    const addressInput = { ...selectedAddress };
    delete addressInput.__typename; // eslint-disable-line no-underscore-dangle
    this.props.setAddress(addressInput);
  };

  render() {
    const {
      id,
      open,
      title,
      labelUseTheSame,
      setUseTheSame,
      selectedAddress,
      onEditRequested,
      submitLabel,
      errors,
      countries,
      availableAddresses,
      defaultSelected
    } = this.props;
    let header;
    let content;

    const { street = [], ...selectedAddressRest } = selectedAddress || {};
    const initialAddressValue = {
      email: '',
      firstname: '',
      lastname: '',
      street1: street[0] || '',
      street2: street.length > 1 ? street[1] : '',
      postcode: '',
      city: '',
      telephone: '',
      countryId: '',
      ...selectedAddressRest
    };

    if (!open && selectedAddress) {
      header = (
        <SectionHeader
          title={title}
          onActionClick={onEditRequested}
          editLabel="Edit"
          complete
          summary={<AddressDetails {...selectedAddress} />}
        />
      );
    } else {
      header = <SectionHeader title={title} />;
    }

    let selectedAvailableAddress;
    // if available addresses are passed then we should display dropdown so the user can pick his saved address
    if (availableAddresses) {
      // compute address that should be selected in the dropdown
      if (this.state.selectedAddressId) {
        // if we have locally selected address id then use it
        selectedAvailableAddress = availableAddresses.find(item => item.id === this.state.selectedAddressId);
      } else if (selectedAddress && selectedAddress.id) {
        // if there's passed selected address then use it
        selectedAvailableAddress = availableAddresses.find(item => item.id === selectedAddress.id);
      } else if (defaultSelected) {
        // if default that should be selected is passed then use it
        selectedAvailableAddress = availableAddresses.find(item => item.id === defaultSelected.id);
      }
    }

    const addressEditor = (
      <React.Fragment>
        {availableAddresses && (
          <AddressPicker
            addresses={availableAddresses}
            selectedAddressId={selectedAvailableAddress ? selectedAvailableAddress.id : 0}
            onChange={addrId => this.setState({ selectedAddressId: addrId })}
          />
        )}
        {!selectedAvailableAddress && (
          <Formik initialValues={initialAddressValue} onSubmit={this.submitAddress}>
            {() => <AddressForm id={id} countries={countries} submitLabel={submitLabel} autoCompleteSection={id} />}
          </Formik>
        )}
        {!!selectedAvailableAddress && (
          <Button my="sm" onClick={this.submitSelectedAddress}>
            <T id="continue" />
          </Button>
        )}
      </React.Fragment>
    );

    if (setUseTheSame) {
      content = (
        <React.Fragment>
          <FlexLayout mb="md">
            <Checkbox
              id="use-default"
              size="sm"
              checked={this.state.useTheSame}
              onChange={ev => this.setState({ useTheSame: ev.target.checked })}
            />
            <Label ml="xs" htmlFor="use-default">
              {labelUseTheSame}
            </Label>
          </FlexLayout>

          {this.state.useTheSame ? (
            <Button onClick={() => this.props.setUseTheSame(true)}>
              <T id="continue" />
            </Button>
          ) : (
            addressEditor
          )}
        </React.Fragment>
      );
    } else if (availableAddresses) {
      content = addressEditor;
    } else {
      content = (
        <Formik initialValues={initialAddressValue} onSubmit={this.submitAddress}>
          {() => <AddressForm id={id} countries={countries} submitLabel={submitLabel} autoCompleteSection={id} />}
        </Formik>
      );
    }

    return (
      <Details open={open}>
        {header}
        <DetailsContent>
          {content}
          <ErrorList errors={errors} />
        </DetailsContent>
      </Details>
    );
  }
}

AddressSection.propTypes = {
  // id of the form - used for generating unique ids for form fields inside
  id: PropTypes.string,
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // title of the section
  title: PropTypes.string,
  // currently selected address
  selectedAddress: PropTypes.shape({}),
  // callback that sets the address
  setAddress: PropTypes.func,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag indicates if "use the same address" is selected - if so then address form is hidden
  useTheSame: PropTypes.bool,
  // callback that sets value for "use the same address" feature
  setUseTheSame: PropTypes.func,
  // label for "use the same address" feature
  labelUseTheSame: PropTypes.string,
  // label for submit button
  submitLabel: PropTypes.string,
  // list of available addresses to pick from - if not passed then address selection field won't be presented
  availableAddresses: PropTypes.arrayOf(PropTypes.shape({})),
  // default selected address - address that should be selected when address picker is shown
  defaultSelected: PropTypes.shape({}),
  // list of available countries
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      localName: PropTypes.string
    })
  ),
  // errors passed from outside that should be displayed for this section
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string
    })
  )
};

export default AddressSection;
