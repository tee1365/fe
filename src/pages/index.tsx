import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = (): JSX.Element => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar></Navbar>
      <div>world</div>
      <br />
      {!data
        ? null
        : data.posts.map((p) => <div id={p.id + ''}>{p.title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
