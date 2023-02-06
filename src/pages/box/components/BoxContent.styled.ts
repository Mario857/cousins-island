import styled from 'styled-components';

export const StyledBox = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  width: 100%;

  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 190px;
  }

  img {
    width: 100%;
  }
`;
