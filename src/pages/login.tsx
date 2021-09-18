import { Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from 'next/link';

const Login = (): JSX.Element => {
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or Email"
              label="username or Email"
            ></InputField>
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            ></InputField>
            <Flex direction="row-reverse" mt={2}>
              <NextLink href="/forgotPassword">
                <Link>forgot password?</Link>
              </NextLink>
            </Flex>
            <Button type="submit" color="teal" mt={4} isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
