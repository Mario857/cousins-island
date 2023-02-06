import { ArrowSortIcon } from 'theme/icons';
import Dropdown from 'components/Dropdown/Dropdown';
import { TokensSortOptions } from 'pages/collection';
import { TokensQuery } from 'utils/blockchain/blockchain.interface';
import { useHistory, useLocation } from 'react-router-dom';

interface SortingProps {
  sortOptions: TokensSortOptions;
  query: TokensQuery;
  setQuery: React.Dispatch<React.SetStateAction<TokensQuery>>;
  getQueryToURL: (updatedQuery: TokensQuery) => string;
}

const Sorting: React.FC<SortingProps> = ({
  sortOptions,
  query,
  setQuery,
  getQueryToURL,
}) => {
  const history = useHistory();
  const location = useLocation();

  const dropdownOptions = sortOptions.map((option) => ({
    ...option,
    onClick: () => {
      const updatedQuery = { ...query, page: 1, sort: option.value };
      const queryToURL = getQueryToURL(updatedQuery);
      setQuery(updatedQuery);
      history.replace({
        pathname: location.pathname,
        search: queryToURL,
      });
    },
  }));

  const selectedOption = sortOptions.find(
    (option) => option.value === query.sort
  );

  return (
    <Dropdown
      id="tokens-sort"
      endIcon={<ArrowSortIcon />}
      options={dropdownOptions}
      selectedOption={selectedOption}
    />
  );
};

export default Sorting;
