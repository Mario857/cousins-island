import React, { useState } from 'react';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';
import { useMediaQuery } from 'react-responsive';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  StyledCollectionLogo,
  StyledCollectionSelected,
} from './CollectionFilter.styled';
import Typography from '@mui/material/Typography';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { CheckIcon } from 'theme/icons';
import Input from 'components/Input/Input';
import { SearchIcon } from 'theme/icons';
import { State } from 'store/store';
import { useSelector } from 'react-redux';
import getLiveCollections from 'utils/getLiveCollections';
import Autocomplete from 'components/Autocomplete/Autocomplete';

interface Option {
  label: string;
  value: string;
}

interface CollectionFilterProps {
  onContractAddressUpdate?: (newContractAddress?: string) => void;
  selectedContractAddress?: string;
  setSelectedContractAddress?: React.Dispatch<React.SetStateAction<string>>;
}

const CollectionFilter: React.FC<CollectionFilterProps> = ({
  onContractAddressUpdate,
  selectedContractAddress,
  setSelectedContractAddress,
}) => {
  const { collections } = useSelector((state: State) => state.collections);

  const liveCollections = getLiveCollections(collections);

  const isMobile = useMediaQuery({ maxWidth: 991 });

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<
    null | NFTCollectionDetails[]
  >(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (searchValue.length >= 3) {
      if (liveCollections) {
        const results = liveCollections.filter((collection) =>
          collection.title.includes(e.target.value)
        );
        setSearchResults(results);
      }
    }
  };

  const collectionsToRender =
    searchValue.length >= 3 ? searchResults : liveCollections;

  if (isMobile) {
    return liveCollections && liveCollections.length > 0 ? (
      <>
        <Input
          placeholder="Search collection"
          startAdornment={<SearchIcon fontSize="small" />}
          sx={{
            height: '44px !important',
            mb: 4,
            background: '#303449 !important',
            borderColor: '#56596a !important',
          }}
          value={searchValue}
          onChange={handleSearch}
        />

        <Box height={225} sx={{ overflowY: 'scroll' }}>
          {collectionsToRender && collectionsToRender.length > 0 ? (
            <>
              {collectionsToRender.map((collection) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  key={`collection-filter-${collection.nftContractAddress}`}
                  mb={2}
                  onClick={() => {
                    if (setSelectedContractAddress) {
                      setSelectedContractAddress(
                        collection.nftContractAddress ===
                          selectedContractAddress
                          ? 'all'
                          : collection.nftContractAddress
                      );
                    }
                  }}
                >
                  {collection.nftContractAddress === selectedContractAddress ? (
                    <StyledCollectionSelected>
                      <CheckIcon fontSize="small" />
                    </StyledCollectionSelected>
                  ) : (
                    <StyledCollectionLogo
                      src={collection.imageURL}
                      alt={collection.title}
                    />
                  )}
                  <Typography variant="body2" color="text.primary" noWrap>
                    {collection.title}
                  </Typography>
                  <ExclusiveMark
                    isExclusive={Boolean(collection.isExclusive)}
                  />
                </Stack>
              ))}
            </>
          ) : (
            <Typography variant="body3" color="text.primary">
              No results
            </Typography>
          )}
        </Box>
      </>
    ) : (
      <Typography variant="body3" color="text.primary">
        No collections
      </Typography>
    );
  }

  const getOptions = () => {
    if (liveCollections) {
      const options = liveCollections.map((collection) => ({
        label: collection.title,
        value: collection.nftContractAddress,
      }));

      return [{ label: 'All collections', value: 'all' }, ...options];
    }
  };

  const options = getOptions();

  return (
    <>
      <Typography variant="h300" color="text.primary" mb={1} component="p">
        Collection Filter
      </Typography>
      {options && (
        <Autocomplete
          options={options}
          getOptionSelected={(option: Option) =>
            option.value === selectedContractAddress
          }
          isOptionEqualToValue={(option: Option, value: string) =>
            option.value === value
          }
          onChange={(event: any, option: Option) => {
            if (onContractAddressUpdate) {
              if (option) onContractAddressUpdate(option.value);
            }
          }}
          ListboxProps={{
            style: {
              maxHeight: 180,
            },
          }}
        />
      )}
    </>
  );
};

export default CollectionFilter;
