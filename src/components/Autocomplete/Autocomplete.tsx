import React from 'react';
import { StyledAutocomplete, StyledTextField } from './Autocomplete.styled';
import { CloseIcon, SearchIcon } from 'theme/icons';

// TODO: Make component more reusable and change type

const Autocomplete: React.FC<any> = ({ ...rest }) => {
  return (
    <StyledAutocomplete
      disablePortal
      clearIcon={<CloseIcon fontSize="small" sx={{ mt: '-1px' }} />}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder="Search collection"
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon fontSize="small" sx={{ ml: 2 }} />,
          }}
        />
      )}
      autoHighlight={false}
      popupIcon={false}
      {...rest}
    />
  );
};
export default Autocomplete;
