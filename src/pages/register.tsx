import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { gql, useMutation } from 'urql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

const REGISTER_MUT = gql`
  mutation RegisterMutation($registerOptions: UsernamePasswordInput!) {
    register(options: $registerOptions) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;

const Register = (): JSX.Element => {
  const [{}, register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          return register({ registerOptions: values });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            ></InputField>
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            ></InputField>
            <Button type="submit" color="teal" mt={4} isLoading={isSubmitting}>
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
