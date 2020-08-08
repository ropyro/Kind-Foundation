import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage } from 'formik';
import { graphql } from 'react-apollo';
import { Box, Text, Link, Input, Button, Details, DetailsContent } from '@deity/falcon-ui';
import { I18n, T } from '@deity/falcon-i18n';
import { SignOutMutation, GET_CUSTOMER, toGridTemplate, OpenSidebarMutation } from '@deity/falcon-ecommerce-uikit';
import SectionHeader from './CheckoutSectionHeader';

const customerEmailFormLayout = {
  customerEmailFormLayout: {
    display: 'grid',
    my: 'xs',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: {
      xs: toGridTemplate([
        ['1fr'   ],
        ['input' ],
        ['button']
      ]),
      md: toGridTemplate([
        ['2fr',   '1fr'   ],
        ['input', 'button']
      ])
    }
  }
};

const emailRx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EmailForm = ({ email = '', setEmail }) => (
  <Formik
    onSubmit={values => setEmail(values.email)}
    initialValues={{ email }}
    validate={values => {
      if (!emailRx.test(values.email.toLowerCase())) {
        return {
          email: 'Invalid email address'
        };
      }
    }}
  >
    {({ values, errors, handleChange }) => (
      <Form>
        <Text>
          <T id="customerSelector.guestPrompt" />
        </Text>
        <Box defaultTheme={customerEmailFormLayout}>
          <Box gridArea="input">
            <Input type="text" name="email" value={values.email} onChange={handleChange} />
            <ErrorMessage name="email" render={msg => <Text color="error">{msg}</Text>} />
          </Box>
          <Button gridArea="button" disabled={errors.email} type="submit">
            <T id="customerSelector.guestContinue" />
          </Button>
        </Box>
      </Form>
    )}
  </Formik>
);

EmailForm.propTypes = {
  setEmail: PropTypes.func.isRequired,
  email: PropTypes.string
};

class EmailSection extends React.Component {
  constructor(props) {
    super(props);

    let email = props.email || '';

    if (props.data && props.data.customer) {
      ({ email } = props.data.customer);
      props.setEmail(email);
    }

    this.state = {
      email: props.email,
      getPrevProps: () => this.props
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      data: { customer: prevCustomer }
    } = prevState.getPrevProps();
    const {
      data: { customer: nextCustomer }
    } = nextProps;

    const { email: prevCustomerEmail } = prevCustomer || {};
    const { email: nextCustomerEmail } = nextCustomer || {};

    if (prevCustomerEmail !== nextCustomerEmail) {
      // user has signed in or out so we have to trigger setEmail() with the new value
      nextProps.setEmail(nextCustomerEmail);

      // if there's no email in nextProps then customer just signed out - in that case we trigger
      // edit process so wizard switches to correct section
      if (!nextCustomerEmail) {
        nextProps.onEditRequested();
      }

      return {
        ...prevState,
        email: nextCustomerEmail || ''
      };
    }

    if (nextProps.email && nextProps.email !== prevState.email) {
      return {
        ...prevState,
        email: nextProps.email
      };
    }

    return null;
  }

  render() {
    let header;
    const { open, data, onEditRequested } = this.props;
    const isSignedIn = !!data.customer;

    if (!open) {
      header = (
        <SignOutMutation>
          {signOut => (
            <I18n>
              {t => (
                <SectionHeader
                  title={t('customerSelector.title')}
                  editLabel={t(isSignedIn ? 'customerSelector.signOut' : 'customerSelector.edit')}
                  onActionClick={isSignedIn ? signOut : onEditRequested}
                  complete
                  summary={<Text>{this.state.email}</Text>}
                />
              )}
            </I18n>
          )}
        </SignOutMutation>
      );
    } else {
      header = <I18n>{t => <SectionHeader title={t('customerSelector.title')} />}</I18n>;
    }

    const content = (
      <OpenSidebarMutation>
        {openSidebar => (
          <Box>
            <EmailForm email={this.state.email} setEmail={this.props.setEmail} />
            <Text>
              <T id="customerSelector.or" />
              <Link
                mx="xs"
                color="primary"
                onClick={() =>
                  openSidebar({
                    variables: {
                      contentType: 'account'
                    }
                  })
                }
              >
                <T id="customerSelector.signInLink" />
              </Link>
              <T id="customerSelector.ifAlreadyRegistered" />
            </Text>
          </Box>
        )}
      </OpenSidebarMutation>
    );

    return (
      <Details open={open}>
        {header}
        {content ? <DetailsContent>{content}</DetailsContent> : null}
      </Details>
    );
  }
}

EmailSection.propTypes = {
  // data form GET_CUSTOMER query
  data: PropTypes.shape({}),
  // currently selected email
  email: PropTypes.string,
  // callback that sets email
  setEmail: PropTypes.func.isRequired,
  // callback that should be called when user requests edit of this particular section
  onEditRequested: PropTypes.func,
  // flag that indicates if the section is currently open
  open: PropTypes.bool
};

EmailSection.defaultProps = {
  email: ''
};

export default graphql(GET_CUSTOMER)(EmailSection);
