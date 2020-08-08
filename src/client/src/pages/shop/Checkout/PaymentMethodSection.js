import React from 'react';
import PropTypes from 'prop-types';
import { Details, DetailsContent, Text, Button } from '@deity/falcon-ui';
import { I18n, T } from '@deity/falcon-i18n';
import { TwoStepWizard } from '@deity/falcon-ecommerce-uikit';
import loadable from 'src/components/loadable';
import ErrorList from '../components/ErrorList';
import SectionHeader from './CheckoutSectionHeader';

// Loading "PaymentMethodItem" component via loadable package
// to avoid premature import of Payment frontend-plugins and their dependencies on SSR
const PaymentMethodItem = loadable(() =>
  import(/* webpackChunkName: "checkout/payment-item" */ './components/PaymentMethodItem')
);

class PaymentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPayment: null,
      additionalData: null
    };
  }

  onPaymentSelected = (selectedPayment, additionalData) => this.setState({ selectedPayment, additionalData });

  resetSelected = () => this.setState({ selectedPayment: null, additionalData: null });

  submitPayment = () => {
    this.props.setPayment(this.state.selectedPayment, this.state.additionalData);
  };

  render() {
    const { open, selectedPayment, onEditRequested, availablePaymentMethods, errors } = this.props;
    let header;
    if (!open && selectedPayment) {
      header = (
        <I18n>
          {t => (
            <SectionHeader
              title={t('checkout.payment')}
              onActionClick={onEditRequested}
              editLabel={t('edit')}
              complete
              summary={<Text>{selectedPayment.title}</Text>}
            />
          )}
        </I18n>
      );
    } else {
      header = <I18n>{t => <SectionHeader title={t('checkout.payment')} />}</I18n>;
    }

    return (
      <Details open={open}>
        {header}
        <DetailsContent>
          {availablePaymentMethods.length === 0 ? (
            <Text color="error" mb="sm">
              <T id="checkout.noPaymentMethodsAvailable" />
            </Text>
          ) : (
            <TwoStepWizard>
              {({ selectedOption, selectOption }) =>
                availablePaymentMethods.map(payment => (
                  <PaymentMethodItem
                    key={payment.code}
                    {...payment}
                    selectOption={code => {
                      this.resetSelected();
                      selectOption(code);
                    }}
                    selectedOption={selectedOption}
                    onPaymentDetailsReady={additionalData => this.onPaymentSelected(payment, additionalData)}
                  />
                ))
              }
            </TwoStepWizard>
          )}
          <ErrorList errors={errors} />
          {availablePaymentMethods.length > 0 && (
            <Button disabled={!this.state.selectedPayment} onClick={this.submitPayment}>
              <T id="continue" />
            </Button>
          )}
        </DetailsContent>
      </Details>
    );
  }
}

PaymentSection.propTypes = {
  // flag that indicates if the section is currently open
  open: PropTypes.bool,
  // all available payment methods
  availablePaymentMethods: PropTypes.arrayOf(PropTypes.shape({})),
  // currently selected payment method
  selectedPayment: PropTypes.shape({}),
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // callback that sets selected payment method
  setPayment: PropTypes.func,
  // errors passed from outside that should be displayed for this section
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string
    })
  )
};

export default PaymentSection;
