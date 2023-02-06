import styled from 'styled-components';
import Accordion from '@mui/material/Accordion';
import { palette } from 'theme/palette';

export const StyledTrait = styled.div`
  border-top: 1px solid ${palette.alphaLight[200]};
  transition: background 350ms;

  &:hover {
    background: ${palette.alphaLight[50]};
  }
`;

export const StyledAccordion = styled(Accordion)`
  background: transparent;

  &:before {
    display: none;
  }

  .MuiAccordionSummary-root {
    padding: 24px;
    background: ${palette.alphaLight[50]};
    border-top: 1px solid ${palette.alphaLight[200]};
  }

  .MuiAccordionSummary-content {
    margin: 0;
  }

  .MuiAccordionDetails-root {
    padding: 0;
  }
`;

export const StyledDescriptionWrapper = styled.div`
  p {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
  ul {
    list-style-type: disc;
    li {
      margin-bottom: 16px;
      margin-left: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;
