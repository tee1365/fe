import { useApolloClient } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const Navbar = (): JSX.Element => {
  // cookie can only be fetched at browser
  const { loading: loadingMe, data } = useMeQuery({ skip: isServer() });
  const [logout, { loading: loadingLogout }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  let body = null;

  if (isServer() || loadingMe) {
    body = <Box>fetching</Box>;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={4}>{data?.me?.username}</Box>
        <Button
          variant="link"
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={loadingLogout}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4} position="sticky" top={0} zIndex={1}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
