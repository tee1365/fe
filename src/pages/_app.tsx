import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import React from 'react';
import theme from '../theme';

const MyApp = ({ Component, pageProps }: any): JSX.Element => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default MyApp;
