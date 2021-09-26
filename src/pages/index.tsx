import { Box, Link, VStack, Text, Flex } from '@chakra-ui/layout';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import NextLink from 'next/link';
import { Button, Heading } from '@chakra-ui/react';

const Index = (): JSX.Element => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { postsLimit: 3, postsCursor: null },
    notifyOnNetworkStatusChange: true,
  });
  if (!loading && !data) {
    return <Text>no post to display or query failed</Text>;
  }

  return (
    <Layout>
      <VStack mt={2} spacing={8}>
        {typeof data === 'undefined'
          ? null
          : data.posts.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px" width="100%">
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
      </VStack>
      {data && !loading && data.posts.hasMore ? (
        <Flex>
          <Button
            mx="auto"
            my={8}
            onClick={() => {
              fetchMore({
                variables: {
                  postsLimit: variables?.postsLimit,
                  postsCursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
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

export default Index;
