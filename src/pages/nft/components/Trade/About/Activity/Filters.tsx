import Box from '@mui/material/Box';
import { StyledTypeButton, StyledFilters } from './Filters.styled';
import Typography from '@mui/material/Typography';
import { Type } from './Activity';
import { LatestTransactionsTypeWithAll } from './Activity';
import React from 'react';

interface FiltersProps {
  types: Type[];
  selectedType: LatestTransactionsTypeWithAll;
  handleSelectType: (newSelectedType: LatestTransactionsTypeWithAll) => void;
}

const Filters: React.FC<FiltersProps> = ({
  types,
  selectedType,
  handleSelectType,
}) => {
  return (
    <StyledFilters>
      <Typography variant="h200" sx={{ color: 'text.primary', mb: 2 }} component="h6">
        Showing:
      </Typography>
      {types.map((type) => (
        <Box
          sx={{ display: 'inline-block', mr: 2 }}
          key={`token-activity-filter-${type.value}`}
        >
          <StyledTypeButton
            isActive={type.value === selectedType}
            type="button"
            onClick={() => handleSelectType(type.value)}
          >
            {type.label}
          </StyledTypeButton>
        </Box>
      ))}
    </StyledFilters>
  );
};

export default Filters;
