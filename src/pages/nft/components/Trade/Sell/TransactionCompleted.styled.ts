import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledImageWrapper = styled.div`
  max-width: max-content;
  padding: 16px;
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 6px;
  display: flex;
  margin: 0 auto;

  img {
    max-height: 245px;
    width: auto;
    margin: 0 auto;
    border-radius: 6px;
  }
`;
