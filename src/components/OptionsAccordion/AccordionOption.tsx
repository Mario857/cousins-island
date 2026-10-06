import React from 'react';
import { StyledAccordionOption } from './AccordionOption.styled';

interface OptionAccordionProps {
  onClick?: () => void;
  children?: React.ReactNode;
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
