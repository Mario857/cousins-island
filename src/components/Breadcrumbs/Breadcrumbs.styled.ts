import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import styled, { css } from 'styled-components';

export const StyledBreadcrumbs = styled(MuiBreadcrumbs)`
  height: 24px;
  display: flex;
  align-items: center;

  .MuiBreadcrumbs-separator {
    margin: 0 1px;
  }
`;

export const StyledBreadcrumb = styled.span<{ isDisabled?: boolean }>`
  a {
    color: ${(props) =>
      !props.isDisabled
        ? props.theme.palette.text.primary
        : props.theme.palette.text.secondary};
    cursor: ${(props) => (!props.isDisabled ? 'pointer' : 'default')};
    text-decoration: none;
    font-size: 14px;
    text-decoration: ${(props) => (!props.isDisabled ? 'underline' : 'none')};
    text-decoration-color: transparent;
    transition: 350ms;

    &:hover {
      text-decoration-color: ${(props) => props.theme.palette.text.primary};
      color: ${(props) =>
        !props.isDisabled
          ? props.theme.palette.text.primary
          : props.theme.palette.text.secondary};
    }
  }
`;
