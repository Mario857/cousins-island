import MuiAlert from '@mui/material/Alert';
import { palette } from 'theme/palette';
import styled, { css } from 'styled-components';

const getStylesBySeverity = (severity: string) => {
  switch (severity) {
    case 'error':
      return css`
        background: rgba(84, 48, 43, 0.58);
        border: 1px solid ${palette.red[50]};
      `;
    case 'warning':
      return css`
        background: rgba(242, 184, 109, 0.18);
        border: 1px solid ${palette.orange[50]};
      `;
    case 'info':
      return css`
        background: ${palette.alphaDark[50]};
        border: 1px solid ${palette.alphaLight[200]};
      `;
    case 'success':
    default:
      return css`
        background: rgba(34, 237, 166, 0.08);
        border: 1px solid ${palette.teal[200]};
      `;
  }
};

export const StyledAlert = styled(MuiAlert)`
  padding: 8px 16px;
  min-height: 52px;
  border-radius: 6px;
  position: relative;

  ${(props) => getStylesBySeverity(props.severity || 'success')};

  .MuiAlert-icon {
    padding: 5px 0;
  }

  .MuiSvgIcon-fontSizeSmall {
    font-size: 20px;
  }

  .MuiAlert-message {
    display: flex;
    align-items: center;
  }

  .MuiBox-root {
    width: 20px;
    height: 20px;
  }

  .MuiAlert-action {
    padding: 5px 0;
    margin-right: 0;
    margin-left: 8px;
    position: absolute;
    top: 8px;
    right: 16px;
  }

  .MuiIconButton-sizeSmall {
    transition: color 350ms;
    padding: 0;
    color: ${(props) => props.theme.palette.text.secondary};
    &:hover {
      color: ${(props) => props.theme.palette.text.primary};
      background: transparent;
    }
  }

  .MuiTypography-body2 {
    font-weight: normal;
  }

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.palette.text.primary};
  }
`;
