import React from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { AngleDownIcon } from 'theme/icons';
import { AccordionProps } from '@mui/material/Accordion';
import {
  StyledAccordion,
  StyledAccordionDetails,
} from './OptionsAccordion.styled';

interface OptionsAccordionProps extends AccordionProps {
  heading: string;
  scrollbar?: boolean;
  maxHeight?: number | 'auto';
  handleExpand?: () => void;
}

const OptionsAccordion: React.FC<OptionsAccordionProps> = ({
  heading,
  scrollbar = true,
  maxHeight = 'auto',
  handleExpand,
  children,
  ...rest
}) => {
  return (
    <StyledAccordion disableGutters {...rest}>
      <AccordionSummary
        expandIcon={<AngleDownIcon fontSize="small" />}
        onClick={handleExpand}
      >
        <Typography variant="body2" color="text.primary">
          {heading}
        </Typography>
      </AccordionSummary>
      <StyledAccordionDetails
        scrollbar={scrollbar ? 'show' : 'hide'}
        sx={{ maxHeight }}
      >
        {children}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default OptionsAccordion;
