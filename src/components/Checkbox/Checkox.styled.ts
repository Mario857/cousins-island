import styled from 'styled-components';
import MuiCheckbox from '@mui/material/Checkbox';

export const StyledCheckbox = styled(MuiCheckbox)`
  border: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  span {
    transition: border 350ms;
    width: ${(props) => (props.size === 'medium' ? '24px' : '20px')};
    height: ${(props) => (props.size === 'medium' ? '24px' : '20px')};
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
  }

  &:hover {
    background: transparent;
  }

  &:hover span {
    border-color: ${(props) =>
      props.disabled
        ? 'rgba(255, 255, 255, 0.32)'
        : props.theme.palette.primary.main} !important;
  }
`;

export const StyledIcon = styled.span`
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.32);
  border-radius: 6px;
`;

export const StyledCheckIcon = styled.span`
  border-radius: 6px;
  background: ${(props) => props.theme.palette.primary.main};
  color: rgba(33, 33, 33, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
`;
