import styled from 'styled-components';
import MuiRadio from '@mui/material/Radio';

export const StyledRadio = styled(MuiRadio)`
  padding: 0;

  span {
    transition: border 350ms;
    width: ${(props) => (props.size === 'medium' ? '24px' : '20px')};
    height: ${(props) => (props.size === 'medium' ? '24px' : '20px')};
    border-width: ${(props) => (props.size === 'medium' ? '6px' : '5px')};
  }

  &:hover {
    background: transparent;
  }

  &:hover span {
    border-color: ${(props) => props.theme.palette.primary.main} !important;
  }
`;

export const StyledIcon = styled.span`
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.32) !important;
  background: rgba(255, 255, 255, 0.04);
  margin-right: 16px;
  margin-left: 12px;

  &:hover {
    border-color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const StyledCheckedIcon = styled.span`
  border-radius: 50%;
  background: #215a46;
  border: 6px solid ${(props) => props.theme.palette.primary.main};
  margin-right: 16px;
  margin-left: 12px;
`;
