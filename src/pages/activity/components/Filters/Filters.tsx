import React from 'react';
import { StyledTypesWrapper } from './Filters.styled';
import TypesFilter from '../TypesFilter/TypesFilter';
import CollectionFilter from '../CollectionFilter/CollectionFilter';
import Box from '@mui/material/Box';
import FiltersHeader from '../FiltersHeader/FiltersHeader';
import { FiltersComponentProps } from '../Activity/Activity';

const Filters: React.FC<FiltersComponentProps> = ({
  selectedType,
  selectedContractAddress,
  handleSelectType,
  handleContractAddressUpdate,
  types,
  resetFilters,
}) => {
  const showResetButton =
    selectedType !== 'all' || selectedContractAddress !== 'all';

  return (
    <Box position="sticky" top={32} right={0}>
      <StyledTypesWrapper>
        <FiltersHeader
          showResetButton={showResetButton}
          resetFilters={resetFilters}
        />
        <TypesFilter
          types={types}
          selectedType={selectedType}
          handleSelectType={handleSelectType}
        />
      </StyledTypesWrapper>
      <CollectionFilter
        onContractAddressUpdate={handleContractAddressUpdate}
        selectedContractAddress={selectedContractAddress}
      />
    </Box>
  );
};

export default Filters;
