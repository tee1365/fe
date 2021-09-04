import { Box, Link } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

const Index = (): JSX.Element => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <NextLink href="/createPost">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data
        ? null
        : data.posts.map((p) => (
            <Box mt={2} id={p.id + ''}>
              {p.title}
            </Box>
          ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
