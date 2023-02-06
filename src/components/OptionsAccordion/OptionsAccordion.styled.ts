import styled, { css } from 'styled-components';
import Accordion from '@mui/material/Accordion';
import AccordionDetails, {
  AccordionDetailsProps,
} from '@mui/material/AccordionDetails';
import { palette } from 'theme/palette';

export const StyledAccordion = styled(Accordion)`
  border: 0;
  box-shadow: none;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0 !important;

  &:before {
    display: none;
  }

  &:after {
    content: '';
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.11);
    position: absolute;
    top: 0;
    left: 0;
  }

  &:first-child {
    &:after {
      display: none;
    }
  }

  &:last-child {
    border-bottom: 0;
  }

  .MuiAccordionDetails-root {
    padding: 0;
  }

  .MuiBox-root {
    background: rgba(255, 255, 255, 0.04);
  }

  .MuiAccordion-root {
    background: rgba(255, 255, 255, 0.04);

    p {
      padding-left: 8px;
    }

    .MuiBox-root {
      padding-left: 24px;
      background: rgba(255, 255, 255, 0.05);
    }

    &:first-child {
      &:after {
        display: block;
      }
    }
  }
`;

interface StyledAccordionDetailsProps extends AccordionDetailsProps {
  scrollbar: 'show' | 'hide';
}

export const StyledAccordionDetails = styled(
  AccordionDetails
)<StyledAccordionDetailsProps>`
  ${(props) =>
    props.scrollbar === 'show' &&
    css`
      overflow-y: auto;
      border-top: 1px solid ${palette.alphaLight[200]};
    `}

  max-height: 250px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.alphaLight[200]};

    &:hover {
      background: ${palette.alphaLight[400]};
    }
  }
`;
