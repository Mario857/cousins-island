import React from 'react';
import { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { StyledTypographyLink } from './TypographyLink.styled';

interface TypographyLinkProps extends MuiLinkProps {
  to?: string;
}

const TypographyLink: React.FC<TypographyLinkProps> = ({
  href,
  to,
  target,
  children,
  underline = 'none',
  ...rest
}) => {
  if (href) {
    return (
      <StyledTypographyLink
        href={href}
        target={target}
        underline={underline}
        {...rest}
      >
        {children}
      </StyledTypographyLink>
    );
  }

  return (
    <StyledTypographyLink
      component={RouterLink}
      underline={underline}
      to={to || '/'}
      {...rest}
    >
      {children}
    </StyledTypographyLink>
  );
};

export default TypographyLink;
