import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledImageWrapper = styled.div`
  width: 245px;
  height: 245px;
  padding: 16px;
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 6px;
  display: flex;
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
    border-radius: 6px;
  }
`;
