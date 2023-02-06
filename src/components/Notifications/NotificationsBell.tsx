import { BellIcon } from 'theme/icons';
import React from 'react';
import { StyledNotificationsBell } from './NotificationsBell.styled';

interface NotificationsBellProps {
  handleOpenNotifications: (
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void;
  open?: boolean;
  dot?: boolean;
}

const NotificationsBell: React.FC<NotificationsBellProps> = ({
  handleOpenNotifications,
  open = true,
  dot = false,
}) => {
  return (
    <StyledNotificationsBell
      onClick={handleOpenNotifications}
      open={open}
      dot={dot}
    >
      <BellIcon fontSize="small" />
    </StyledNotificationsBell>
  );
};

export default NotificationsBell;
