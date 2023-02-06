import Chip from 'components/Chip/Chip';
import React from 'react';
import Typography from '@mui/material/Typography';
import { CloseIcon } from 'theme/icons';
import { StyledButton } from './ActiveFilter.styled';

interface ActiveFilterProps {
  activeFilter: {
    name: string;
    value: string;
    rarity: number;
  };
  handleFilterToggle: (
    filterName: string,
    traitValue: string,
    isChecked: boolean
  ) => void;
}

const ActiveFilter: React.FC<ActiveFilterProps> = ({
  activeFilter,
  handleFilterToggle,
}) => {
  const getLabel = () => {
    return (
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {activeFilter.name}:{' '}
        <Typography variant="h100" sx={{ fontWeight: 600 }}>
          {activeFilter.value}{' '}
          {activeFilter.rarity && activeFilter.rarity > 0
            ? `(${activeFilter.rarity}%)`
            : ''}
        </Typography>
      </Typography>
    );
  };

  return (
    <Chip
      size="small"
      label={getLabel()}
      clickable={false}
      deleteIcon={
        <StyledButton>
          <CloseIcon fontSize="small" />
        </StyledButton>
      }
      onDelete={() =>
        handleFilterToggle(activeFilter.name, activeFilter.value, true)
      }
      sx={{ mb: '16px !important', mr: { xs: 'auto', md: 2 } }}
    ></Chip>
  );
};

export default ActiveFilter;
