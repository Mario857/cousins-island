import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

export interface StyledLoadingSpinnerProps {
  size?: 'large' | 'medium' | 'small';
  color?: 'primary' | 'secondary';
}

const getStylesBySize = (size: StyledLoadingSpinnerProps['size']) => {
  switch (size) {
    case 'large':
      return css`
        height: 36px;
        width: 36px;
        border-width: 5px;
      `;
    case 'small':
      return css`
        height: 10px;
        width: 10px;
      `;
    case 'medium':
    default:
      return css`
        height: 16px;
        width: 16px;
      `;
  }
};

export const StyledLoadingSpinner = styled.div<StyledLoadingSpinnerProps>`
  border: ${(props) =>
    props.color === 'secondary'
      ? '3px rgba(255, 255, 255, 0.3) solid'
      : '3px #22bb85 solid'};
  border-top: ${(props) =>
    props.color === 'secondary' ? '3px #e8e8e8 solid' : '3px #214c3d solid'};
  border-radius: 50%;
  animation: ${spin} 1s infinite linear;
  ${(props) => getStylesBySize(props.size || 'medium')}
`;

export const StyledLoadingSpinnerContainer = styled.div<{ center?: boolean }>`
  ${(props) =>
    props.center &&
    css`
      min-height: calc(100vh - 70px) !important;
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;
