import React from 'react';
import Checkbox from 'components/Checkbox/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AccordionOption from 'components/OptionsAccordion/AccordionOption';

interface TraitFilterProps {
  name: string;
  trait: any;
  handleToggle: (
    filterName: string,
    traitValue: string,
    isChecked: boolean
  ) => void;
  isChecked: boolean;
}

const TraitFilter: React.FC<TraitFilterProps> = ({
  name,
  trait,
  handleToggle,
  isChecked,
}) => {
  return (
    <AccordionOption
      onClick={() => {
        handleToggle(name, trait.value, isChecked);
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="body2"
          color="text.primary"
          component="p"
          sx={{ wordBreak: 'break-word', maxWidth: '85%' }}
        >
          {trait.value === '' || trait.value === null ? 'None' : trait.value}{' '}
          {trait.rarity && trait.rarity > 0 ? `(${trait.rarity}%)` : ''}
        </Typography>
        <Checkbox checked={isChecked} />
      </Stack>
    </AccordionOption>
  );
};

export default React.memo(TraitFilter);

// export default React.memo(TraitFilter, (prevProps, nextProps) => {
//   return prevProps.isChecked === nextProps.isChecked;
// });
