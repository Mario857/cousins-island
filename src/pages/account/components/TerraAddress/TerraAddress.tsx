import { useState, useEffect } from 'react';
import { CopyFileIcon, WalletIcon } from 'theme/icons';
import useClipboard from 'react-use-clipboard';
import Tooltip from '@mui/material/Tooltip';
import { useWallet } from '@terra-money/wallet-provider';
import { StyledTerraAddress, StyledButton } from './TerraAddress.styled';

const TerraAddress = () => {
  const { wallets } = useWallet();
  const [terraAddress, setTerraAddress] = useState('');

  useEffect(() => {
    if (wallets?.[0]) {
      setTerraAddress(wallets[0].terraAddress);
    }
  }, [wallets]);

  const [isCopied, setCopied] = useClipboard(terraAddress);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const handleCopy = () => {
    setCopied();
    setShowCopyTooltip(true);

    setTimeout(() => {
      setShowCopyTooltip(false);
    }, 1000);
  };

  return (
    <StyledTerraAddress>
      <WalletIcon viewBox="0 -4 24 24" sx={{ mr: '3px' }} />
      {terraAddress}
      <StyledButton onClick={handleCopy}>
        <Tooltip title="Text copied!" open={showCopyTooltip} arrow>
          <CopyFileIcon fontSize="small" />
        </Tooltip>
      </StyledButton>
    </StyledTerraAddress>
  );
};

export default TerraAddress;
