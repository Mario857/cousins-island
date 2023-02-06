import {
  NFTCollectionDetails,
  NFTTokenDetails,
  TokensQuery,
} from 'utils/blockchain/blockchain.interface';
import React from 'react';
import Grid from '@mui/material/Grid';
import NFTCard from 'components/NFTCard/NFTCard';
import {
  StyledCollectionNFTs,
  StyledLoaderContainer,
} from './CollectionNFTs.styled';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import NotFound from 'components/NotFound/NotFound';
import * as ROUTES from 'constants/routes';
import Typography from '@mui/material/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@mui/material/Box';

interface CollectionNFTsProps {
  collection: {
    details?: NFTCollectionDetails | null;
    tokens?: {
      pagesCount?: number;
      data?: NFTTokenDetails[];
    } | null;
  } | null;
  query: TokensQuery;
  setQuery: React.Dispatch<React.SetStateAction<TokensQuery>>;
  loading?: boolean;
  initialQuery: TokensQuery;
  fetchMoreTokens: (query: TokensQuery) => void;
  hasMore: boolean;
}

const CollectionNFTs: React.FC<CollectionNFTsProps> = ({
  collection,
  query,
  setQuery,
  loading,
  initialQuery,
  fetchMoreTokens,
  hasMore,
}) => {
  const tokens = collection?.tokens?.data;

  const history = useHistory();

  const resetQuery = () => {
    history.push(
      `${ROUTES.COLLECTIONS}/${collection?.details?.nftContractAddress}`
    );
    setQuery(initialQuery);
  };

  return (
    <StyledCollectionNFTs>
      {loading && (
        <StyledLoaderContainer>
          <LoadingSpinner size="large" color="secondary" />
        </StyledLoaderContainer>
      )}
      {!loading && (!tokens || (tokens && tokens.length)) <= 0 && (
        <NotFound
          heading="No Items Found"
          description="Sorry, we've not been able to find the items you are looking for. Please try again or show all items in this collection."
          buttonOnClick={resetQuery}
          buttonTitle="Show All Items"
        />
      )}
      {!loading && tokens && tokens.length > 0 && (
        <InfiniteScroll
          dataLength={tokens.length}
          next={() => fetchMoreTokens(query)}
          hasMore={hasMore}
          loader={
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <LoadingSpinner size="large" color="secondary" />
            </Box>
          }
          endMessage={
            <Typography
              variant="body3"
              color="text.primary"
              textAlign="center"
              component="p"
              mt={4}
              sx={{ width: '100%' }}
            >
              That's all!
            </Typography>
          }
          className="infinite-scroll-grid"
          scrollThreshold={0.9}
          style={{ overflowY: 'hidden' }}
        >
          {tokens.map((token) => (
            <Grid item xs={12} md={4} key={token.tokenId}>
              <NFTCard
                token={token}
                isExclusive={Boolean(collection?.details?.isExclusive)}
                isVideo={Boolean(collection?.details?.isVideo)}
                glitchedNFTs={Boolean(
                  collection?.details?.glitchedNFTs?.includes(token.tokenId)
                )}
              />
            </Grid>
          ))}
        </InfiniteScroll>
      )}
    </StyledCollectionNFTs>
  );
};

export default CollectionNFTs;
