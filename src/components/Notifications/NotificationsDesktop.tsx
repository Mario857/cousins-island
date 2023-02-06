import {
	StyledLine,
	StyledNotificationsDesktop,
} from './NotificationsDesktop.styled'
import Notification from './Notification'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/store'
import NotificationsBell from './NotificationsBell'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { CheckIcon } from 'theme/icons'
import { StyledMenu } from './NotificationsDesktop.styled'
import Stack from '@mui/material/Stack'
import TextButton from 'components/Button/TextButton'
import { Link } from 'react-router-dom'
import * as ROUTES from 'constants/routes'
import { markNotificationsAsRead } from 'store/actions/notifications'

const NotificationsDesktop = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const { notifications, userHasUnreadNotifications } = useSelector(
		(state: State) => state.notifications
	)

	const handleOpenNotifications = (
		event?: React.MouseEvent<HTMLButtonElement>
	) => {
		if (event) setAnchorEl(event.currentTarget)
	}

	const handleCloseNotifications = () => {
		setAnchorEl(null)
	}

	const [showTooltip, setShowTooltip] = useState(false)

	const dispatch = useDispatch()

	const markNotificationsasViewed = () => {
		if (!notifications) return

		dispatch(markNotificationsAsRead(notifications) as any)

		setShowTooltip(true)

		setTimeout(() => {
			setShowTooltip(false)
		}, 2000)
	}

	return (
		<>
			<NotificationsBell
				handleOpenNotifications={handleOpenNotifications}
				dot={userHasUnreadNotifications}
				open={open}
			/>
			<StyledMenu
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseNotifications}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<div>
					{notifications && notifications.length > 0 ? (
						<>
							<Stack
								direction='row'
								alignItems='center'
								justifyContent='space-between'
								mb={2}
							>
								<Typography variant='h200' color='text.primary' component='h6'>
									Notifications
								</Typography>
								<Tooltip open={showTooltip} title='Notifications marked as read' arrow>
									<TextButton
										color='primary'
										startIcon={<CheckIcon />}
										sx={{ fontWeight: '400 !important' }}
										disabled={!userHasUnreadNotifications}
										onClick={markNotificationsasViewed}
									>
										Mark as read
									</TextButton>
								</Tooltip>
							</Stack>
							<StyledNotificationsDesktop>
								{notifications.map(notification => (
									<Notification
										notification={notification}
										key={`notification-${notification.timestamp}`}
									/>
								))}
							</StyledNotificationsDesktop>
							<StyledLine />
						</>
					) : (
						<>
							<Typography variant='h200' color='text.primary' component='h6'>
								No notifications
							</Typography>
							<Typography
								variant='body2'
								color='text.secondary'
								component='p'
								mt={1}
								mb={3}
							>
								Here you will find notifications about your sales, but first
								<br />
								someone have to buy one of your items
							</Typography>
						</>
					)}

					<Link to={ROUTES.MY_ACTIVITY}>
						<TextButton color='primary' sx={{ fontWeight: '400 !important' }}>
							View my activity
						</TextButton>
					</Link>
				</div>
			</StyledMenu>
		</>
	)
}

export default NotificationsDesktop
