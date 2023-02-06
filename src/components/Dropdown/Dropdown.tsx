import React, { useState } from 'react';
import { ArrowSortIcon } from 'theme/icons';
import Button from 'components/Button/Button';
import { StyledDropdown } from './Dropdown.styled';
import Menu from '@mui/material/Menu';
import MenuItem from 'components/MenuItem/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useElementWidth } from 'hooks/useElementWidth';

interface DropdownProps {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  id: string;
  options: {
    label: string;
    value: any;
    onClick: () => void;
  }[];
  selectedOption?: {
    label: string;
    value: any;
  };
}

const Dropdown: React.FC<DropdownProps> = ({
  startIcon,
  endIcon,
  id,
  options,
  selectedOption,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { width } = useElementWidth(id);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledDropdown>
      <Button
        id={id}
        variant="contained"
        color="tertiary"
        type="button"
        endIcon={endIcon}
        startIcon={startIcon}
        fullWidth
        onClick={handleOpen}
      >
        {selectedOption?.label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList sx={{ width }}>
          {options.map((option, index) => (
            <MenuItem
              arrow
              key={`${id}-item-${index}`}
              onClick={() => {
                option.onClick();
                handleClose();
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </StyledDropdown>
  );
};

export default Dropdown;
