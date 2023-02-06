import { NFTTokenDetails } from 'utils/blockchain/blockchain.interface';
import React from 'react';
import Grid, { GridSize } from '@mui/material/Grid';
import EmptyList from '../EmptyList/EmptyList';
import NFTCard from 'components/NFTCard/NFTCard';
import Fade from '@mui/material/Fade';
import AccountLoader from '../AccountLoader/AccountLoader';
import Box from '@mui/material/Box';
import Button from 'components/Button/Button';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Typography from '@mui/material/Typography';
import { State } from 'store/store';
import { useSelector } from 'react-redux';

interface TokensProps {
  tokens: NFTTokenDetails[] | null;
  loading?: boolean;
  getMoreTokens?: () => void;
  canLoadMore?: boolean;
  loadingMore?: boolean;
  alreadyLoadedMore?: boolean;
  tokensPerRow?: GridSize;
}

const Tokens: React.FC<TokensProps> = ({
  tokens,
  loading,
  getMoreTokens,
  canLoadMore,
  loadingMore,
  alreadyLoadedMore,
  tokensPerRow = 4,
}) => {
  const { collections } = useSelector((state: State) => state.collections);

  if (loading) {
    return <AccountLoader />;
  }

  if (!tokens || (tokens && tokens.length <= 0)) return <EmptyList />;

  return (
    <Fade in={true}>
      <div>
        <Grid container spacing={4}>
          {tokens.map((token) => (
            <Grid
              item
              xs={12}
              md={tokensPerRow}
              key={token?.name || `#${token?.tokenId}`}
            >
              <NFTCard
                token={token}
                showPrice={false}
                isExclusive={Boolean(
                  collections &&
                    token.nftContractAddress &&
                    collections.find(
                      (collection) =>
                        collection.nftContractAddress ===
                        token.nftContractAddress
                    )?.isExclusive
                )}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={6} textAlign="center" sx={{ minHeight: 48 }}>
          {canLoadMore ? (
            <Button
              variant="contained"
              color="primary"
              type="button"
              sx={{ minWidth: 178 }}
              onClick={getMoreTokens}
              loadingIndicator={<LoadingSpinner />}
              loading={loadingMore}
            >
              Load more
            </Button>
          ) : (
            <Typography variant="body3" color="text.primary" component="p">
              {alreadyLoadedMore ? "You've reached the end of the list" : ''}
            </Typography>
          )}
        </Box>
      </div>
    </Fade>
  );
};

export default Tokens;
