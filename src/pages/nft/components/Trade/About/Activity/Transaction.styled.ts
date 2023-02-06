import styled from 'styled-components';
import { palette } from 'theme/palette';

export const StyledTransaction = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${palette.alphaLight[200]};

  &:last-child {
    border-bottom: 0;
  }
`;

export const StyledLabel = styled.div`
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[200]};
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.palette.text.primary};
  height: 40px;

  .MuiSvgIcon-fontSizeSmall {
    font-size: 19px;
    margin-right: 8px;
  }
`;
