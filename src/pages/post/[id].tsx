import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Heading, Box, IconButton, Link } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import React, { ReactNode } from 'react';
import Layout from '../../components/Layout';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from '../../generated/graphql';
import NextLink from 'next/link';

const Post = () => {
  const router = useRouter();
  const { data: me } = useMeQuery();

  const [deletePost] = useDeletePostMutation();

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
        {data.post.creatorId === me?.me?.id ? (
          <Box>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="delete-post"
              onClick={() => {
                deletePost({
                  variables: {
                    deletePostId: data.post!.id,
                  },
                  update: (cache) => {
                    cache.evict({ fieldName: 'posts' });
                  },
                });
                router.push('/');
              }}
              mr={4}
            ></IconButton>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${data.post.id}`}>
              <IconButton
                icon={<EditIcon />}
                aria-label="edit-post"
                as={Link}
              ></IconButton>
            </NextLink>
          </Box>
        ) : null}
        <Heading mb={4}>{data.post.title}</Heading>
        {data.post.text}
      </>
    );
  }

  return <Layout>{body}</Layout>;
};

export default Post;
