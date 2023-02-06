import styled from 'styled-components';

export const StyledBoxImage = styled.div`
  height: 100%;
  .MuiCard-root {
    height: 100%;
    border-radius: 14px;
  }
`;

export const StyledImageContainer = styled.div`
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
  }
`;
