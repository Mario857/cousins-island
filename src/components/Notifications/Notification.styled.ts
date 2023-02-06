import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledNotification = styled.div`
  margin-top: 24px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 350ms;
  display: block;
  position: relative;
  padding-bottom: 24px;

  &:before {
    content: '';
    position: absolute;
    width: calc(100% - 32px);
    height: 1px;
    background: ${palette.alphaLight[200]};
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    ${(props) => props.theme.breakpoints.up('md')} {
      display: none;
    }
  }

  &:last-child {
    &:before {
      content: '';
      height: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 8px;
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }
  }

  &:hover {
    ${(props) => props.theme.breakpoints.up('md')} {
      background: ${palette.alphaLight[50]};
      border-color: ${palette.alphaLight[50]};
    }
  }
`;

export const StyledBadge = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.secondary};
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border-radius: 6px;
  background: ${palette.alphaLight[50]};
  width: max-content;
  padding: 8px 12px;
`;

export const StyledTextContainer = styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    max-width: 328px;
  }
`;

export const StyledDot = styled.div<{ color: 'gray' | 'red' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.color === 'gray' ? palette.alphaLight[200] : '#E9513A'};
  margin-top: 6px;
`;

export const StyledImageWrapper = styled.div`
  height: 68px;
  width: 68px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

export const StyledImage = styled.img<{ loaded?: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.loaded ? 1 : 0)} !important;
`;

export const StyledImagePlaceholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: ${palette.alphaLight[100]};
`;
