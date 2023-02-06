import { AlertProps as MuiAlertProps } from '@mui/material';
import React from 'react';
import { StyledAlert } from './Alert.styled';
import Typography from '@mui/material/Typography';
import {
  CheckCircleIcon,
  CloseIcon,
  GlitchedSignIcon,
  InfoIcon,
} from 'theme/icons';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AlertTitle from '@mui/material/AlertTitle';

interface AlertProps extends MuiAlertProps {
  title?: string;
  description?: string | JSX.Element;
  showIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  severity,
  onClose,
  showIcon = true,
  variant = 'filled',
  children,
  icon,
  ...rest
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return (
          <Box color="error.light">
            <InfoIcon fontSize="small" />
          </Box>
        );
      case 'warning':
        return (
          <Box color="warning.light">
            <InfoIcon fontSize="small" />
          </Box>
        );
      case 'info':
        return (
          <Box marginTop={'3px'}>
            <GlitchedSignIcon fontSize="small" />
          </Box>
        );
      case 'success':
      default:
        return (
          <Box color="primary.main">
            <CheckCircleIcon fontSize="small" />
          </Box>
        );
    }
  };

  return (
    <StyledAlert
      variant={variant}
      severity={severity}
      icon={showIcon && (icon || getIcon())}
      action={
        onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        )
      }
      {...rest}
    >
      <span>
        {title && (
          <AlertTitle sx={{ mb: description ? 1 : 0, textAlign: 'left' }}>
            <Typography variant="h200" color="text.primary">
              {title}
            </Typography>
          </AlertTitle>
        )}
        {description && (
          <Typography
            variant="body2"
            color={variant === 'standard' ? 'text.primary' : 'text.secondary'}
          >
            {description}
          </Typography>
        )}
        {children}
      </span>
    </StyledAlert>
  );
};

export default Alert;
