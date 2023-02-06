import { StyledMenuItem } from './MenuItem.styled';
import { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import { ArrowRightIcon } from 'theme/icons';

interface MenuItemProps extends MuiMenuItemProps {
  arrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ arrow, children, ...rest }) => {
  return (
    <StyledMenuItem {...rest}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100% !important' }}
        spacing={3}
      >
        <ListItemText primary={children} />
        {arrow && <ArrowRightIcon fontSize="small" />}
      </Stack>
    </StyledMenuItem>
  );
};

export default MenuItem;
