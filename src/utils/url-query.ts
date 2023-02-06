import queryString from 'query-string';

export const parseFilterQuery = (filterName: string, query: string) => {
  const parsedQuery = queryString.parse(query);

  const queryKeys = Object.keys(parsedQuery);

  let newQuery = {};

  for (let i = 0; i < queryKeys.length; i++) {
    const key = queryKeys[i];
    if (key.startsWith(filterName)) {
      const newQueryKey = key.substring(
        key.indexOf('[') + 1,
        key.lastIndexOf(']')
      );
      newQuery = {
        ...newQuery,
        [newQueryKey]: Array.isArray(parsedQuery[key])
          ? parsedQuery[key]
          : [parsedQuery[key]],
      };
    }
  }

  return newQuery;
};
