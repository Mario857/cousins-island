import {
  StyledButtonClose,
  StyledHeader,
  StyledModalContainer,
} from './Modal.styled';
import { ModalProps as MuiModalProps } from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import { CloseIcon } from 'theme/icons';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

declare const window: any;

interface ModalProps extends MuiModalProps {
  heading?: string | JSX.Element;
  subheading?: string | JSX.Element;
  description?: string | JSX.Element;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  width?: number;
  variant?: 'primary' | 'secondary';
  allowClose?: boolean;
  header?: JSX.Element;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  heading,
  subheading,
  description,
  children,
  setOpen,
  width = 600,
  variant = 'primary',
  open,
  allowClose = true,
  header,
  onClose,
  ...rest
}) => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const handleClose = () => {
    if (allowClose) {
      if (onClose) onClose();
      else setOpen(false);
    }
  };

  useEffect(() => {
    if (open && isMobile) {
      window.Intercom('update', {
        hide_default_launcher: true,
      });
    }

    return () => {
      if (open && isMobile) {
        window.Intercom('update', {
          hide_default_launcher: false,
        });
      }
    };
  }, [open, isMobile]);

  return (
    <MuiModal
      onClose={handleClose}
      BackdropComponent={Backdrop}
      disableEscapeKeyDown={true}
      open={open}
      BackdropProps={{
        timeout: 500,
      }}
      {...rest}
    >
      <StyledModalContainer width={width}>
        <StyledButtonClose onClick={handleClose} disabled={!allowClose}>
          <CloseIcon fontSize="small" />
        </StyledButtonClose>
        <div style={{ width: '100%' }}>
          <Box pt={3} px={3}>
            {heading && (
              <Typography
                variant={variant === 'primary' ? 'h600' : 'h400'}
                component="h3"
                color="text.primary"
                mb={1}
              >
                {heading}
              </Typography>
            )}
            {subheading && (
              <Typography
                variant="body4"
                color="text.primary"
                mb={3}
                component="p"
              >
                {subheading}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="text.primary" component="p">
                {description}
              </Typography>
            )}
          </Box>
          {header && <StyledHeader>{header}</StyledHeader>}
          <Box mt={header ? 2 : 4} px={3} pb={3}>
            {children}
          </Box>
        </div>
      </StyledModalContainer>
    </MuiModal>
  );
};

export default Modal;
