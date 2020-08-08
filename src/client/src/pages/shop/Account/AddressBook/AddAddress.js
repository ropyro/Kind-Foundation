import React from 'react';
import { NavLink } from 'react-router-dom';
import { Formik } from 'formik';
import { T } from '@deity/falcon-i18n';
import { H1, Button, FlexLayout, GridLayout } from '@deity/falcon-ui';
import {
  Form,
  FormField,
  CheckboxFormField,
  FormErrorSummary,
  TwoColumnsLayout,
  TwoColumnsLayoutArea,
  AddAddressMutation,
  CountriesQuery,
  CountrySelector
} from '@deity/falcon-ecommerce-uikit';

const AddAddress = ({ history }) => (
  <GridLayout mb="md" gridGap="md">
    <H1>
      <T id="addAddress.title" />
    </H1>
    <AddAddressMutation>
      {(addAddress, { loading, error }) => (
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            street1: '',
            street2: '',
            postcode: '',
            city: '',
            countryId: '',
            company: '',
            telephone: '',
            defaultBilling: false,
            defaultShipping: false
          }}
          onSubmit={({ street1, street2, ...values }) =>
            addAddress({
              variables: {
                input: {
                  ...values,
                  street: [street1, street2]
                }
              }
            }).then(() => history.push('/account/address-book'))
          }
        >
          {() => (
            <Form id="add-address" i18nId="addAddress">
              <CheckboxFormField name="defaultBilling" />
              <CheckboxFormField name="defaultShipping" />
              <TwoColumnsLayout>
                <GridLayout gridArea={TwoColumnsLayoutArea.left}>
                  <FormField name="company" />
                  <FormField name="firstname" required />
                  <FormField name="lastname" required />
                  <FormField name="telephone" />
                </GridLayout>
                <GridLayout gridArea={TwoColumnsLayoutArea.right}>
                  <FormField name="street1" required />
                  <FormField name="street2" />
                  <FormField name="postcode" required />
                  <FormField name="city" required />
                  <FormField name="countryId" required>
                    {({ form, field }) => (
                      <CountriesQuery passLoading>
                        {({ countries = { items: [] } }) => (
                          <CountrySelector
                            {...field}
                            onChange={x => form.setFieldValue(field.name, x)}
                            items={countries.items}
                          />
                        )}
                      </CountriesQuery>
                    )}
                  </FormField>
                </GridLayout>
              </TwoColumnsLayout>
              <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
                <Button as={NavLink} to="/account/address-book" mr="md">
                  <T id="addAddress.cancelButton" />
                </Button>
                <Button type="submit" variant={loading ? 'loader' : undefined}>
                  <T id="addAddress.submitButton" />
                </Button>
              </FlexLayout>
              <FormErrorSummary errors={error && [error.message]} />
            </Form>
          )}
        </Formik>
      )}
    </AddAddressMutation>
  </GridLayout>
);

export default AddAddress;
