import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledBadge = styled.div`
  font-family: 'Libre Franklin', sans-serif;
  background: ${(props) => props.theme.palette.error.light};
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: uppercase;
`;

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${palette.red[200]};
`;
