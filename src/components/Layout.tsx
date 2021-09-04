import { ReactNode } from 'react';
import Navbar from './Navbar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
  children: ReactNode;
}

const Layout = ({
  children,
  variant = 'regular',
}: LayoutProps): JSX.Element => {
  return (
    <>
      <Navbar></Navbar>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
