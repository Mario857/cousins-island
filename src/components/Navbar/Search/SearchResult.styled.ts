import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledSearchResult = styled.div`
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: ${palette.alphaLight[50]};
  }
`;

export const StyledLogo = styled.img`
  width: 33px;
  height: 33px;
  border-radius: 50%;
`;
