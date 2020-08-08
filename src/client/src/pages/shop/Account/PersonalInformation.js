import React from 'react';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { H1, FlexLayout, GridLayout, Button, Link } from '@deity/falcon-ui';
import {
  FormField,
  Form,
  FormErrorSummary,
  CustomerQuery,
  EditCustomerMutation,
  TwoColumnsLayout,
  TwoColumnsLayoutArea
} from '@deity/falcon-ecommerce-uikit';

const PersonalInformation = () => (
  <GridLayout mb="md" gridGap="md">
    <H1>
      <T id="editCustomer.title" />
    </H1>
    <TwoColumnsLayout my="md">
      <CustomerQuery>
        {({ customer }) => (
          <EditCustomerMutation>
            {(editCustomer, { loading, error }) => (
              <Formik
                initialValues={{
                  firstname: customer.firstname,
                  lastname: customer.lastname,
                  email: customer.email
                }}
                onSubmit={values =>
                  editCustomer({
                    variables: {
                      input: {
                        ...values,
                        websiteId: customer.websiteId
                      }
                    }
                  })
                }
              >
                {() => (
                  <GridLayout as={Form} id="edit-customer" i18nId="editCustomer" gridArea={TwoColumnsLayoutArea.left}>
                    <FormField name="firstname" required />
                    <FormField name="lastname" required />
                    <FormField name="email" required />
                    <FlexLayout justifyContent="space-between" alignItems="center" mt="md">
                      <Link as={RouterLink} to="/account/change-password">
                        <T id="editCustomer.changePassword" />
                      </Link>
                      <Button type="submit" variant={loading ? 'loader' : undefined}>
                        <T id="editCustomer.submitButton" />
                      </Button>
                    </FlexLayout>
                    <FormErrorSummary errors={error && [error.message]} />
                  </GridLayout>
                )}
              </Formik>
            )}
          </EditCustomerMutation>
        )}
      </CustomerQuery>
    </TwoColumnsLayout>
  </GridLayout>
);

export default PersonalInformation;
