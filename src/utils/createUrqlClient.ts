import { QueryInput, Cache, cacheExchange } from '@urql/exchange-graphcache';
import router from 'next/dist/client/router';
import { dedupExchange, errorExchange, fetchExchange } from 'urql';
import {
  CreatePostMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  RegisterMutation,
} from '../generated/graphql';

const betterUpdateQuery = <Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) => {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
};

export const createUrqlClient = (ssrExchange: any) => {
  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
            createPost: (_result, args, cache, info) => {
              betterUpdateQuery<CreatePostMutation, PostsQuery>(
                cache,
                {
                  query: PostsDocument,
                },
                _result,
                (result, query) => {
                  query.posts.push(result.createPost);
                  return {
                    posts: query.posts,
                  };
                }
              );
            },
          },
        },
      }),
      errorExchange({
        onError: (error) => {
          if (error.message.includes('[GraphQL] Not authenticated')) {
            router.replace('/login');
          }
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  };
};
