import React from 'react';
import { StyledOptionsAccordionWrapper } from './OptionsAccordionWrapper.styled';

const OptionsAccordionWrapper: React.FC = ({ children }) => {
  return (
    <StyledOptionsAccordionWrapper>{children}</StyledOptionsAccordionWrapper>
  );
};

export default OptionsAccordionWrapper;
