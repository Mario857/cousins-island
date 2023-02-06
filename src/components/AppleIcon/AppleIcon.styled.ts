import styled from 'styled-components';

export interface StyledAppleIconProps {
  size?: 'small' | 'large';
}

export const StyledAppleIcon = styled.img<StyledAppleIconProps>`
  width: 24px;

  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${(props) => (props.size === 'small' ? '32px' : '46px')};
  }

  margin-bottom: -3px;
`;
