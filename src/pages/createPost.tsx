import { Button } from '@chakra-ui/button';
import { Formik, Form } from 'formik';
import router from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';

const createPost = (): JSX.Element => {
  const [, createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await createPost({ createPostInput: values });
          if (!error) {
            router.push('/');
          } else {
            console.log(error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            ></InputField>
            <InputField
              textarea
              name="text"
              placeholder="text..."
              label="Body"
            ></InputField>
            <Button type="submit" color="teal" mt={4} isLoading={isSubmitting}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(createPost);
