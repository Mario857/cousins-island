import React from 'react';
import { StyledAccordionOption } from './AccordionOption.styled';

interface OptionAccordionProps {
  onClick?: () => void;
}

const OptionAccordion: React.FC<OptionAccordionProps> = ({
  onClick,
  children,
}) => {
  return (
    <StyledAccordionOption onClick={onClick}>{children}</StyledAccordionOption>
  );
};

export default OptionAccordion;
