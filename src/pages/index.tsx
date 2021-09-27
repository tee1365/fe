import { Box, Link, VStack, Text, Flex } from '@chakra-ui/layout';
import Layout from '../components/Layout';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import NextLink from 'next/link';
import { Button, Heading, IconButton } from '@chakra-ui/react';
import React from 'react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = (): JSX.Element => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { postsLimit: 3, postsCursor: null },
    notifyOnNetworkStatusChange: true,
  });

  const { data: me } = useMeQuery();

  const [deletePost] = useDeletePostMutation();

  if (!loading && !data) {
    return <Text>no post to display or query failed</Text>;
  }

  return (
    <Layout>
      <VStack mt={2} spacing={8}>
        {typeof data === 'undefined'
          ? null
          : data.posts.posts.map((p) => (
              <Box
                flex={1}
                key={p.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                width="100%"
              >
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Flex align="center">
                  <Text mt={4} flex={1}>
                    {p.textSnippet}
                  </Text>
                  {p.creator.id === me?.me?.id ? (
                    <Box>
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="delete-post"
                        onClick={() => {
                          deletePost({
                            variables: {
                              deletePostId: p.id,
                            },
                            update: (cache) => {
                              cache.evict({ fieldName: 'posts' });
                            },
                          });
                        }}
                        mr={4}
                      ></IconButton>
                      <NextLink href="post/edit/[id]" as={`post/edit/${p.id}`}>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="edit-post"
                          as={Link}
                        ></IconButton>
                      </NextLink>
                    </Box>
                  ) : null}
                </Flex>
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
