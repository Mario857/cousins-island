import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledPrice = styled.div`
  height: 56px;
  background: ${palette.alphaLight[100]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;
