import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import router from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            ></InputField>
            {tokenError ? (
              <Flex justifyContent="space-between">
                <Box color="red">{tokenError}</Box>
                <NextLink href="/forgotPassword">
                  <Link>Go forget page</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button type="submit" color="teal" mt={4} isLoading={isSubmitting}>
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
