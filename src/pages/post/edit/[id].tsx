import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/dist/client/router';
import { ReactNode } from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useIsAuth } from '../../../utils/useIsAuth';

const EditPost = () => {
  const [updatePost] = useUpdatePostMutation();
  useIsAuth();
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? +router.query.id : -1;
  const { data, loading, error } = usePostQuery({
    variables: {
      postId: intId,
    },
    skip: intId === -1,
  });

  let body: ReactNode;

  if (loading) {
    body = null;
  } else if (error) {
    body = <Box>{error.message}</Box>;
  } else if (!data?.post) {
    body = <Box>Could not find post</Box>;
  } else {
    body = (
      <>
        <Formik
          initialValues={{
            title: data?.post?.title || '',
            text: data?.post?.text || '',
          }}
          onSubmit={async (values) => {
            const { errors } = await updatePost({
              variables: {
                updatePostId: intId,
                updatePostText: values.text,
                updatePostTitle: values.title,
              },
              update: (cache) => {
                cache.evict({ fieldName: 'posts' });
              },
            });
            if (!errors) {
              router.back();
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
              <Button
                type="submit"
                color="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }

  return <Layout variant="small">{body}</Layout>;
};

export default EditPost;
