import React from 'react';
import Chip from 'components/Chip/Chip';
import Box from '@mui/material/Box';

interface TypesFilterProps {
  types: {
    label: string;
    value: string;
    icon?: JSX.Element;
  }[];
  selectedType: string;
  setSelectedType?: React.Dispatch<React.SetStateAction<string>>;
  handleSelectType?: (newSelectedType: string) => void;
}

const TypesFilter: React.FC<TypesFilterProps> = ({
  types,
  selectedType,
  setSelectedType,
  handleSelectType,
}) => {
  return (
    <Box
      width="100%"
      sx={{ overflowX: { xs: 'scroll', md: 'auto' } }}
      mb={{ xs: 3, md: 0 }}
    >
      <Box minWidth={{ xs: 460, md: 'auto' }}>
        {types &&
          types.length > 0 &&
          types.map((type, index) => (
            <Chip
              key={`activity-type-${type.value}`}
              size="medium"
              label={type.label}
              icon={type.icon}
              clickable
              sx={{
                mr: index !== types.length - 1 ? 2 : 0,
                mb: { md: 2 },
                minWidth: { md: 115 },
              }}
              color={selectedType === type.value ? 'primary' : 'secondary'}
              onClick={() => {
                if (setSelectedType) return setSelectedType(type.value);
                if (handleSelectType) return handleSelectType(type.value);
              }}
            />
          ))}
      </Box>
    </Box>
  );
};

export default TypesFilter;
