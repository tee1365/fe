import { Box, Link, VStack, Text, Flex } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import Layout from '../components/Layout';
import { PostsQueryVariables, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Button, Heading } from '@chakra-ui/react';

const Index = (): JSX.Element => {
  const [variables, setVariables] = useState<PostsQueryVariables>({
    postsLimit: 10,
    postsCursor: null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <Text>no post to display or query failed</Text>;
  }

  return (
    <Layout>
      <Flex alignItems="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/createPost">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      <VStack mt={2} spacing={8}>
        {typeof data === 'undefined' || fetching ? (
          <Text mt={4}>fetching...</Text>
        ) : (
          data.posts.posts!.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px" width="100%">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))
        )}
      </VStack>
      {data && !fetching && data.posts.hasMore ? (
        <Flex>
          <Button
            mx="auto"
            my={8}
            onClick={() => {
              setVariables({
                postsLimit: variables.postsLimit,
                postsCursor:
                  data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
