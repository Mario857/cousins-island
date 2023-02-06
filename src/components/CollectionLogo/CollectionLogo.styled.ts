import { palette } from 'theme/palette';
import styled, { css } from 'styled-components';

export interface StyledCollectionLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const getStylesBySize = (size: StyledCollectionLogoProps['size']) => {
  switch (size) {
    case 'small':
      return css`
        width: 48px;
        height: 48px;
        border-radius: 4px;
        padding: 4px;

        img {
          border-radius: 4px;
        }
      `;
    case 'large':
      return css`
        width: 96px;
        height: 96px;
        padding: 8px;
        border-radius: 8px;

        img {
          border-radius: 8px;
        }
      `;
    case 'medium':
    default:
      return css`
        width: 78px;
        height: 78px;
        border-radius: 8px;
        padding: 8px;

        img {
          border-radius: 8px;
        }
      `;
  }
};

export const StyledCollectionLogo = styled.div<StyledCollectionLogoProps>`
  ${(props) => getStylesBySize(props.size || 'medium')};
  border: 1px solid ${palette.alphaLight[200]};
  background: #535b73;

  img {
    width: 100%;
    height: 100%;
  }
`;
