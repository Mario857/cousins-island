import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';
import { palette } from 'theme/palette';
import styled, { css } from 'styled-components';

const getChipStylesByColor = (
  color: MuiChipProps['color'],
  isClickable: boolean
) => {
  switch (color) {
    case 'primary':
      return css`
        background: ${palette.alphaLight[200]};
        border: 1px solid ${palette.alphaLight[200]};

        &:hover {
          background: ${palette.alphaLight[200]};
        }
      `;
    case 'success':
      return css`
        background: ${palette.teal[200]};
        color: rgba(33, 33, 33, 0.72);
        border: 1px solid transparent;

        .MuiChip-icon {
          color: rgba(33, 33, 33, 0.72) !important;
        }

        &:hover {
          background: ${palette.teal[200]};
        }
      `;
    case 'secondary':
    default:
      return css`
        background: ${palette.alphaLight[50]};
        border: 1px solid ${palette.alphaLight[200]};

        &:hover {
          background: ${palette.alphaLight[50]};

          ${(props) => props.theme.breakpoints.up('md')} {
            background: ${isClickable
              ? palette.alphaLight[200]
              : palette.alphaLight[50]};
          }
        }
      `;
  }
};

const getChipStylesBySize = (size: MuiChipProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        height: 32px;
        padding: 8px 12px;
        font-size: 13px;
      `;
    default:
    case 'medium':
      return css`
        height: 48px;
        padding: 12px 20px;
      `;
  }
};

export const StyledChip = styled(MuiChip)`
  border-radius: 999px;
  color: ${(props) => props.theme.palette.text.primary};
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  max-width: 100% !important;

  ${(props) => getChipStylesBySize(props.size)};
  ${(props) => getChipStylesByColor(props.color, Boolean(props.clickable))};

  .MuiChip-label {
    padding: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .MuiChip-icon {
    margin-left: 0px;
    margin-right: 8px;
    color: ${(props) => props.theme.palette.text.primary};
  }

  .MuiChip-deleteIcon {
    margin-left: 8px;
    margin-right: 0;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;
