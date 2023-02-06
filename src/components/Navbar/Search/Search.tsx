import { useEffect, useState } from 'react';
import Input from 'components/Input/Input';
import { ArrowLeftIcon, SearchIcon } from 'theme/icons';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {
  StyledArrowButton,
  StyledBackdrop,
  StyledSearch,
  StyledSearchResults,
} from './Search.styled';
import SearchResult from './SearchResult';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import getLiveCollections from 'utils/getLiveCollections';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<null | NFTCollectionDetails[]>(null);
  const { collections } = useSelector((state: State) => state.collections);

  const isMobile = useMediaQuery({ maxWidth: 1010 });
  const isMediumScreen = useMediaQuery({ maxWidth: 1060 });

  const [openOnMobile, setOpenOnMobile] = useState(false);

  const getResults = (value: string) => {
    if (collections) {
      const liveCollections = getLiveCollections(collections);

      const results = liveCollections.filter((collection) => {
        const collectionTitle = collection.title.toLowerCase();

        return collectionTitle.includes(value.toLowerCase());
      });

      setResults(results);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchValue(value);

    if (value.length >= 2) {
      getResults(value);
      setShowResults(true);
    }

    if (value.length < 2 && showResults) {
      setResults(null);
      setShowResults(false);
    }
  };

  const handleClickAway = () => {
    setResults(null);
    setShowResults(false);
    setSearchValue('');
  };

  const handleOpenOnMobile = () => {
    if (isMobile) {
      setOpenOnMobile(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseOnMobile = () => {
    setOpenOnMobile(false);
    document.body.style.overflow = 'auto';
    handleClickAway();
  };

  return (
    <StyledSearch openOnMobile={openOnMobile}>
      <ClickAwayListener
        onClickAway={() => {
          if (isMobile) return;
          handleClickAway();
        }}
      >
        <Box
          position="relative"
          width="100%"
          maxWidth={isMediumScreen && !isMobile ? 165 : '100%'}
        >
          <Input
            placeholder="Search collection"
            startAdornment={
              openOnMobile ? (
                <StyledArrowButton onClick={handleCloseOnMobile}>
                  <ArrowLeftIcon />
                </StyledArrowButton>
              ) : (
                <SearchIcon fontSize="small" />
              )
            }
            size="small"
            fullWidth
            value={searchValue}
            onChange={handleChange}
            onFocus={handleOpenOnMobile}
            sx={{
              zIndex: 5,
              fontSize: { md: '12px !important', lg: '14px !important' },
            }}
          />
          {showResults ? (
            <StyledSearchResults>
              {results && results.length > 0 ? (
                results.map((result, index) => (
                  <SearchResult
                    key={`navbar-search-result-${index}`}
                    result={result}
                    onCloseOnMobile={handleCloseOnMobile}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.primary">
                  No results
                </Typography>
              )}
            </StyledSearchResults>
          ) : null}
        </Box>
      </ClickAwayListener>
      {!isMobile && <StyledBackdrop open={showResults} />}
    </StyledSearch>
  );
};

export default Search;
