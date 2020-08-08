import React from 'react';
import { Formik } from 'formik';
import { NavLink } from 'react-router-dom';
import { T } from '@deity/falcon-i18n';
import { H1, FlexLayout, GridLayout, Button } from '@deity/falcon-ui';
import {
  FormField,
  Form,
  FormErrorSummary,
  ChangePasswordMutation,
  TwoColumnsLayout,
  TwoColumnsLayoutArea,
  PasswordRevealInput
} from '@deity/falcon-ecommerce-uikit';

const ChangePassword = ({ history }) => (
  <GridLayout mb="md" gridGap="md">
    <H1>
      <T id="changePassword.title" />
    </H1>
    <TwoColumnsLayout>
      <ChangePasswordMutation>
        {(changePassword, { loading, error }) => (
          <Formik
            initialValues={{ currentPassword: '', password: '' }}
            onSubmit={values => changePassword({ variables: { input: values } }).then(() => history.push('/account'))}
          >
            {() => (
              <GridLayout as={Form} id="change-password" i18nId="changePassword" gridArea={TwoColumnsLayoutArea.left}>
                <FormField
                  name="currentPassword"
                  type="password"
                  // pass empty array, so default password strength validator does not get triggered
                  validate={[]}
                  required
                >
                  {({ field }) => <PasswordRevealInput {...field} />}
                </FormField>
                <FormField
                  name="password"
                  type="password"
                  // pass empty array, so default password strength validator does not get triggered
                  validate={[]}
                  required
                  autoComplete="new-password"
                >
                  {({ field }) => <PasswordRevealInput {...field} />}
                </FormField>
                <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
                  <Button as={NavLink} to="/account/personal-information" mr="md">
                    <T id="changePassword.cancelButton" />
                  </Button>
                  <Button type="submit" variant={loading ? 'loader' : undefined}>
                    <T id="changePassword.submitButton" />
                  </Button>
                </FlexLayout>
                <FormErrorSummary errors={error && [error.message]} />
              </GridLayout>
            )}
          </Formik>
        )}
      </ChangePasswordMutation>
    </TwoColumnsLayout>
  </GridLayout>
);

export default ChangePassword;
