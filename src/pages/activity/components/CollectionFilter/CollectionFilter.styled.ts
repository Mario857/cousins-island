import styled from 'styled-components';
import { palette } from 'theme/palette';

export const StyledCollectionLogo = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
`;

export const StyledCollectionSelected = styled.div`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.palette.text.primary};
  background: ${palette.alphaLight[200]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 50%;
`;
