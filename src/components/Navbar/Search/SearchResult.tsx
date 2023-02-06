import React from 'react';
import { StyledLogo, StyledSearchResult } from './SearchResult.styled';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';
import { formatDecimal } from 'utils/formatNumbers';
import * as ROUTES from 'constants/routes';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import { AngleRightIcon } from 'theme/icons';

interface SearchResultProps {
  result: NFTCollectionDetails;
  onCloseOnMobile: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  result,
  onCloseOnMobile,
}) => {
  const { title, imageURL, totalTokensCount, isExclusive, nftContractAddress } =
    result;

  const history = useHistory();

  const handleClick = () => {
    const collectionURL = `${ROUTES.COLLECTIONS}/${nftContractAddress}`;
    history.push(collectionURL);

    onCloseOnMobile();
  };

  return (
    <StyledSearchResult onClick={handleClick}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ minWidth: { xs: '80%', md: '100%' } }}
        >
          <StyledLogo src={imageURL} alt={title} />
          <Box width="100%">
            <Stack direction="row" alignItems="center" sx={{ width: '80%' }}>
              <Typography
                variant="h200"
                color="text.primary"
                component="h6"
                noWrap
              >
                {title}
              </Typography>
              <ExclusiveMark
                isExclusive={Boolean(isExclusive)}
                sx={{ ml: '4px' }}
              />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {formatDecimal(totalTokensCount, 0)} items
            </Typography>
          </Box>
        </Stack>
        <AngleRightIcon fontSize="small" sx={{ display: { md: 'none' } }} />
      </Stack>
    </StyledSearchResult>
  );
};

export default SearchResult;
