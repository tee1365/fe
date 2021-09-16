import { stringifyVariables } from '@urql/core';
import { Resolver } from '@urql/exchange-graphcache';

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentFieldKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const postInfos = allFields.filter((info) => info.fieldName === 'posts');
    const size = postInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const inTheCache = cache.resolve(entityKey, 'posts');
    console.log('inTheCache: ', inTheCache);
    let hasMore = true;
    info.partial = true;
    const results: string[] = [];
    postInfos.forEach((fi) => {
      const post = cache.resolve(entityKey, 'posts') as string[];
      const _hasMore = cache.resolve(entityKey, 'hasMore') as boolean;
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      results.push(...post);
    });
    return { __typename: 'PaginatedPosts', posts: results, hasMore };
  };
};
