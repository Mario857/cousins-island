import Button from '../Button/Button';
import {
  AngleDownIcon,
  AngleUpIcon,
  CopyFileIcon,
  LoginAltIcon,
  MoneyStackIcon,
  WalletIcon,
} from 'theme/icons';
import Typography from '@mui/material/Typography';
import { WalletNotConnectedProps } from './WalletNotConnected';
import { useWallet } from '@terra-money/wallet-provider';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState, useCallback } from 'react';
import useClipboard from 'react-use-clipboard';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { getShortText } from 'utils/getShortText';
import {
  formatLUARTDecimal,
  formatLUNADecimal,
  formatUSTDecimal,
} from 'utils/currency';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

const WalletConnected: React.FC<WalletNotConnectedProps> = ({
  open,
  anchorEl,
  handleCloseMenu,
  handleOpenMenu,
  btnConnectedId,
}) => {
  const wallet = useWallet();
  const { wallets, disconnect, status } = wallet;

  const { balance } = useSelector((state: State) => state.account);

  const terraAddress = wallets[0].terraAddress;
  const shortTerraAddress = getShortText(terraAddress, 6);

  const [isCopied, setCopied] = useClipboard(terraAddress);

  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 991 });

  const history = useHistory();

  const disconnectWallet = useCallback(() => {
    disconnect();
    handleCloseMenu();
  }, [disconnect]);

  const menuItems = [
    {
      title: shortTerraAddress,
      heading: true,
    },
    {
      divider: true,
    },
    {
      title: 'Deposit & Withdraw',
      icon: <MoneyStackIcon fontSize="small" />,
      onClick: () => {
        history.push(ROUTES.LUART_WALLET);
      },
    },
    {
      title: 'Copy Address',
      icon: <CopyFileIcon fontSize="small" />,
      tooltip: true,
      onClick: () => {
        setCopied();
        setShowCopyTooltip(true);
        setTimeout(() => {
          setShowCopyTooltip(false);
        }, 1000);
      },
    },
    {
      title: 'Disconnect Wallet',
      icon: <LoginAltIcon fontSize="small" />,
      onClick: () => {
        if (window.confirm('Disconnect from Terra Station?'))
          disconnectWallet();
      },
    },
    {
      divider: true,
    },
    {
      title: 'Current Terra Balance',
      heading: true,
    },
    {
      title: '$UST',
      value: formatUSTDecimal(balance.ust),
      disabled: true,
    },
    {
      title: '$LUNA',
      value: formatLUNADecimal(balance.luna),
      disabled: true,
    },
    {
      title: '$COUSIN',
      value: formatLUARTDecimal(balance.luart),
      disabled: true,
    },
  ];

  const renderMenuItems = (data: typeof menuItems) => {
    return data.map((item, index) => {
      if (item.divider) {
        return <Divider key={`connected-menu-item-${index}`} />;
      }
      return (
        <MenuItem
          key={`connected-menu-item-${index}`}
          onClick={item.onClick}
          disabled={item.disabled || item.heading}
        >
          {item.heading ? (
            <Typography variant="body1" component="span" color="text.secondary">
              {item.title}
            </Typography>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: '100%',
              }}
            >
              <Typography variant="body2" color="text.primary">
                {item.title}
              </Typography>
              {item.icon ? (
                item.tooltip ? (
                  <Tooltip title="Text copied!" open={showCopyTooltip} arrow>
                    <Box color="text.secondary">{item.icon}</Box>
                  </Tooltip>
                ) : (
                  <Box color="text.secondary">{item.icon}</Box>
                )
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {item.value}
                </Typography>
              )}
            </Stack>
          )}
        </MenuItem>
      );
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="light"
        size="medium"
        id={btnConnectedId}
        startIcon={<WalletIcon viewBox="0 -2 20 20" />}
        endIcon={
          !isMobile ? open ? <AngleUpIcon /> : <AngleDownIcon /> : undefined
        }
        aria-controls="connected-wallet-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpenMenu}
        sx={{ fontWeight: '400 !important' }}
      >
        {shortTerraAddress}
      </Button>
      <Menu
        id="wallet-connected-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={
          !isMobile
            ? { vertical: 'bottom', horizontal: 'right' }
            : { vertical: 'bottom', horizontal: 'center' }
        }
        transformOrigin={
          !isMobile
            ? { vertical: 'top', horizontal: 'right' }
            : { vertical: 'top', horizontal: 'center' }
        }
      >
        <MenuList sx={{ minWidth: { xs: '100%', md: '280px' } }}>
          {renderMenuItems(menuItems)}
        </MenuList>
      </Menu>
    </>
  );
};

export default WalletConnected;
