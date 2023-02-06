import React from 'react';
import Stack from '@mui/material/Stack';
import TextButton from 'components/Button/TextButton';
import Typography from '@mui/material/Typography';

interface FiltersHeaderProps {
  resetFilters: () => void;
  showResetButton: boolean;
}

const FiltersHeader: React.FC<FiltersHeaderProps> = ({
  resetFilters,
  showResetButton,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} mb={{ md: 3 }}>
      <Typography
        variant="h500"
        component="h5"
        color="text.primary"
        sx={{ fontSize: '24px !important' }}
      >
        Filters
      </Typography>
      {showResetButton && (
        <TextButton
          color="primary"
          size="large"
          type="button"
          onClick={resetFilters}
        >
          Reset Filters
        </TextButton>
      )}
    </Stack>
  );
};

export default FiltersHeader;
