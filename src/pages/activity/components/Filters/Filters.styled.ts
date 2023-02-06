import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledTypesWrapper = styled.div`
  padding-bottom: 8px;
  border-bottom: 1px solid ${palette.alphaLight[200]};
  margin-bottom: 24px;

  .MuiSvgIcon-fontSizeMedium {
    font-size: 24px;
    color: ${(props) => props.theme.palette.text.primary};
    margin-right: 10px;
    margin-bottom: -3px;
  }
`;
