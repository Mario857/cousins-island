import { palette } from 'theme/palette';
import styled from 'styled-components';

export const StyledLinkWrapper = styled.span`
  a {
    color: ${(props) => props.theme.palette.text.primary};
    cursor: pointer;

    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: 14px;
    }

    &:hover {
      color: ${(props) => props.theme.palette.text.primary};
      text-decoration: underline;
    }
  }
`;

export const StyledImageWrapper = styled.div`
  width: 72px;
  height: 72px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;

  ${(props) => props.theme.breakpoints.up('md')} {
    width: 110px;
    height: 110px;
  }
`;

export const StyledImage = styled.img<{ loaded?: boolean }>`
  position: absolute;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
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

export const StyledBadge = styled.div`
  height: 32px;
  background: ${palette.alphaLight[50]};
  border: 1px solid ${palette.alphaLight[100]};
  color: ${(props) => props.theme.palette.text.primary};
  width: max-content;
  padding: 0 12px;
  padding-top: 1px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 8px;

  .MuiSvgIcon-fontSizeSmall {
    font-size: 16px;
    margin-right: 8px;
  }
`;

export const StyledLink = styled.a`
  color: ${(props) => props.theme.palette.text.primary};
  margin: 0;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;
