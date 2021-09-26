import { Button } from '@chakra-ui/button';
import { Formik, Form } from 'formik';
import router from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';

const createPost = (): JSX.Element => {
  const [createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { createPostInput: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts' });
            },
          });
          if (!errors) {
            router.push('/');
          } else {
            console.log(errors);
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

export default createPost;
