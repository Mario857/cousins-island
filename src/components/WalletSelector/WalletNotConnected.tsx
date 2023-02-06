import Button from '../Button/Button';
import { WalletIcon } from 'theme/icons';
import Menu from './Menu';
import MenuItem from './MenuItem';
import Typography from '@mui/material/Typography';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { useMediaQuery } from 'react-responsive';
import Divider from '@mui/material/Divider';

export interface WalletNotConnectedProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  handleCloseMenu: () => void;
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isPrimary?: boolean;
  btnNotConnectedId: string;
  btnConnectedId: string;
}

const WalletNotConnected: React.FC<WalletNotConnectedProps> = ({
  open,
  anchorEl,
  handleCloseMenu,
  handleOpenMenu,
  isPrimary,
  btnNotConnectedId,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 991 });

  const wallet = useWallet();

  const { availableConnections, availableInstallations, connect } = wallet;

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return connect(ConnectType.WALLETCONNECT);

    handleOpenMenu(event);
  };

  return (
    <>
      <Button
        variant="contained"
        color={isPrimary ? 'primary' : 'light'}
        size={isPrimary ? 'large' : 'medium'}
        id={btnNotConnectedId}
        startIcon={isPrimary ? undefined : <WalletIcon viewBox="0 -2 20 20" />}
        aria-controls="not-connected-wallet-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleButtonClick}
        fullWidth={isPrimary}
        sx={{ fontWeight: '400 !important' }}
      >
        Connect Wallet
      </Button>
      <Menu
        id="not-connected-wallet-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': btnNotConnectedId,
        }}
      >
        <MenuItem onClick={handleCloseMenu} disabled>
          <Typography variant="body1" color="text.secondary">
            Wallet connection method
          </Typography>
        </MenuItem>
        <Divider />
        {availableConnections
          .filter(({ type }) => type !== ConnectType.READONLY)
          .map(({ type, name, identifier }) => (
            <MenuItem
              key={`wallet-available-connection-${identifier}`}
              onClick={() => {
                handleCloseMenu();
                connect(type, identifier);
              }}
            >
              <Typography variant="body2" color="text.primary">
                {name}
              </Typography>
            </MenuItem>
          ))}
        {availableInstallations
          .filter(({ type }) => type === ConnectType.EXTENSION)
          .map(({ type, identifier, name, url }) => (
            <MenuItem
              key={`wallet-available-installation-${identifier}-${type}`}
              onClick={() => {
                handleCloseMenu();
                window.open(url, '_blank');
              }}
            >
              <Typography variant="body2" color="text.primary">
                Install {name}
              </Typography>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default WalletNotConnected;
