import { StyledContainer, StyledHeader } from './NotificationsMobile.styled';
import Typography from '@mui/material/Typography';
import { AngleLeftIcon } from 'theme/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNotificationsOnMobile } from 'store/actions/notifications';
import { State } from 'store/store';
import { useEffect, useState } from 'react';
import blockchainModule from 'utils/blockchain/blockchain';
import Box from '@mui/material/Box';
import Notification from './Notification';

declare const window: any;

const NotificationsMobile = () => {
  const { notifications } = useSelector((state: State) => state.notifications);

  const dispatch = useDispatch();

  useEffect(() => {
    window.Intercom('update', {
      hide_default_launcher: true,
    });

    return () => {
      window.Intercom('update', {
        hide_default_launcher: false,
      });

      dispatch(toggleNotificationsOnMobile(false));
    };
  }, []);

  return (
    <StyledContainer>
      <StyledHeader>
        <button
          type="button"
          onClick={() => dispatch(toggleNotificationsOnMobile(false))}
        >
          <AngleLeftIcon />
        </button>
        <Typography
          variant="h400"
          color="text.primary"
          component="h6"
          sx={{ fontSize: '20px !important' }}
        >
          Notifications
        </Typography>
      </StyledHeader>
      {notifications && notifications.length > 0 ? (
        <Box px={2}>
          {notifications.map((notification) => (
            <Notification
              notification={notification}
              key={`notification-${notification.timestamp}`}
            />
          ))}
        </Box>
      ) : (
        <Box
          textAlign="center"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          sx={{ minHeight: 'calc(100vh - 57px)' }}
        >
          <Typography
            variant="h400"
            color="text.primary"
            component="h6"
            mb={2}
            sx={{ lineHeight: '32px !important', fontSize: '20px !important' }}
          >
            No notifications
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            component="p"
            sx={{ lineHeight: '20px !important' }}
          >
            Here you will find notifications about your sales, but first someone
            have to buy one of your items
          </Typography>
        </Box>
      )}
    </StyledContainer>
  );
};

export default NotificationsMobile;
