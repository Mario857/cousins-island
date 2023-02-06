import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledTerraAddress = styled.div`
  height: 48px;
  padding: 14px 48px;
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 6px;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 16px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  .MuiSvgIcon-fontSizeMedium {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    width: auto;
  }

  button {
    margin-left: 8px;
  }
`;

export const StyledButton = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: ${(props) => props.theme.palette.text.primary};
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;

  .MuiSvgIcon-fontSizeSmall {
    margin-right: 0;
  }
`;
