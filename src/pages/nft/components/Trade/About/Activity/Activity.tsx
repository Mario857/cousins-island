import { State } from 'store/store';
import { BoltIcon, FlameIcon, ShoppingBagIcon } from 'theme/icons';
import blockchainModule from 'utils/blockchain/blockchain';
import {
  LatestTransactionDetails,
  LatestTransactionsQuery,
  LatestTransactionsType,
} from 'utils/blockchain/blockchain.interface';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Filters from './Filters';
import Transaction from './Transaction';
import Box from '@mui/material/Box';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Typography from '@mui/material/Typography';
import Button from 'components/Button/Button';

const LIMIT = 5; // number of transactions per page

export type LatestTransactionsTypeWithAll = LatestTransactionsType | 'all';

export interface Type {
  label: string;
  value: LatestTransactionsTypeWithAll;
  icon?: JSX.Element;
}

const types: Type[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Purchase',
    value: 'marketplace_execute_order',
    icon: <ShoppingBagIcon fontSize="small" />,
  },
  {
    label: 'Listing',
    value: 'marketplace_post_sell_order',
    icon: <BoltIcon fontSize="small" />,
  },
  {
    label: 'Bid',
    value: 'marketplace_post_buy_order',
    icon: <FlameIcon fontSize="small" />,
  },
];

const Activity = () => {
  const [transactions, setTransactions] = useState<
    null | LatestTransactionDetails[]
  >(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState({
    getTransactions: true,
    fetchMoreTransactions: false,
  });
  const [loadedMore, setLoadedMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [selectedType, setSelectedType] =
    useState<LatestTransactionsTypeWithAll>('all');

  const { tokenDetails } = useSelector((state: State) => state.token);

  const nftContractAddress = tokenDetails?.nftContractAddress || '';
  const tokenId = tokenDetails?.tokenId || '';

  const query: LatestTransactionsQuery = {
    limit: LIMIT,
    offset: 0,
    type: [],
  };

  const handleSelectType = (
    newSelectedType: LatestTransactionsType | 'all'
  ) => {
    if (newSelectedType === selectedType) return;

    setOffset(0);
    setSelectedType(newSelectedType);
    setTransactions(null);
    setLoadedMore(false);
  };

  const getTransactionsForToken = () => {
    if (transactions) {
      setLoading((loading) => ({ ...loading, fetchMoreTransactions: true }));
    } else {
      setLoading((loading) => ({ ...loading, getTransactions: true }));
    }

    const types = (
      selectedType === 'all'
        ? [
            'marketplace_execute_order',
            'marketplace_post_sell_order',
            'marketplace_post_buy_order',
          ]
        : [selectedType]
    ) as LatestTransactionsType[];

    setTimeout(async () => {
      try {
        const params = {
          ...query,
          type: types,
          offset,
          nftContractAddress,
        };

        const { latestTransactions, currentOffset } =
          await blockchainModule.getTransactionsForToken(params, tokenId);

        if (latestTransactions && latestTransactions.length < query.limit) {
          console.log('wykonano1');
          setCanLoadMore(false);
        } else {
          setCanLoadMore(true);
        }

        setTransactions((transactions: any) =>
          transactions
            ? [...transactions, ...latestTransactions]
            : latestTransactions
        );
        setOffset(currentOffset);
      } catch (error) {
        console.log(error);
      }

      setLoading({ getTransactions: false, fetchMoreTransactions: false });
    }, 500);
  };

  useEffect(() => {
    if (!transactions) getTransactionsForToken();
  }, [offset, transactions, selectedType]);

  return (
    <>
      <Filters
        types={types}
        selectedType={selectedType}
        handleSelectType={handleSelectType}
      />
      {loading.getTransactions ||
      !transactions ||
      (transactions && transactions.length <= 0) ? (
        <Box p={3} display="flex" justifyContent="center">
          {loading.getTransactions ? (
            <LoadingSpinner color="secondary" size="large" />
          ) : (
            <Typography variant="h300" color="text.primary" component="h6">
              No activities found
            </Typography>
          )}
        </Box>
      ) : (
        transactions &&
        transactions.length > 0 &&
        transactions.map((transaction, index) => (
          <Transaction
            key={`token-activity-transaction-${index}`}
            transaction={transaction}
            types={types}
          />
        ))
      )}
      {(canLoadMore || loadedMore) && !loading.getTransactions && (
        <Box p={3} display="flex" justifyContent="center">
          {canLoadMore && (
            <Button
              variant="contained"
              color="tertiary"
              type="button"
              fullWidth
              onClick={() => {
                getTransactionsForToken();
                setLoadedMore(true);
              }}
              loading={loading.fetchMoreTransactions}
              loadingIndicator={<LoadingSpinner color="secondary" />}
            >
              {loading.fetchMoreTransactions ? '' : 'Load More'}
            </Button>
          )}
          {!canLoadMore && loadedMore && (
            <Typography variant="h300" color="text.primary" component="h6">
              That's all!
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};

export default Activity;
