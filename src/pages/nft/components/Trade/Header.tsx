import Heading from 'components/Heading/Heading';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from 'components/Card/CardHeader';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import * as ROUTES from 'constants/routes';
import TypographyLink from 'components/TypographyLink/TypographyLink';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import styled from 'styled-components';
import useCopyClipboard from 'react-use-clipboard';
import { useState } from 'react';
import { CopyFileIcon } from 'theme/icons';
import Tooltip from '@mui/material/Tooltip';
import Alert from 'components/Alert/Alert';

const StyledCopyButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  color: ${(props) => props.theme.palette.text.primary};

  transition: color 350ms;

  &:hover {
    ${(props) => props.theme.breakpoints.up('md')} {
      color: ${(props) => props.theme.palette.text.secondary};
    }
  }

  &:focus {
    outline: none;
  }
`;

interface HeaderProps {
  previousQuery: string;
}

const Header: React.FC<HeaderProps> = ({ previousQuery }) => {
  const { tokenDetails, userTradingDetails, collection } = useSelector(
    (state: State) => state.token
  );

  const ownerAddress = userTradingDetails?.owner;
  const tokenName = tokenDetails?.name;
  const collectionTitle = tokenDetails?.collectionTitle;
  const nftContractAddress = tokenDetails?.nftContractAddress;

  const [isCopied, setCopied] = useCopyClipboard(ownerAddress || '');
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  const checkIfGlitched = (): boolean => {
    if (collection?.glitchedNFTs && tokenDetails?.tokenId) {
      return collection?.glitchedNFTs.includes(tokenDetails?.tokenId);
    }
    return false;
  };

  const handleCopy = () => {
    setCopied();
    setShowCopyTooltip(true);
    setTimeout(() => {
      setShowCopyTooltip(false);
    }, 1000);
  };

  return (
    <CardHeader>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent={{ sm: 'space-between' }}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <TypographyLink
            variant="body4"
            color="text.secondary"
            to={`${ROUTES.COLLECTIONS}/${nftContractAddress}${
              previousQuery || ''
            }`}
          >
            {collectionTitle}
            <ExclusiveMark
              isExclusive={Boolean(collection?.isExclusive || false)}
            />
          </TypographyLink>
        </Stack>
      </Stack>
      <Heading
        variant="h700"
        component="h3"
        mb={1}
        sx={{ wordWrap: 'break-word' }}
      >
        {tokenName}
      </Heading>
      <Stack spacing={1} direction="row" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Owner
        </Typography>
        <Typography variant="body2" color="text.primary" noWrap>
          {ownerAddress}
        </Typography>
        <Tooltip title="Text copied!" open={showCopyTooltip} arrow>
          <StyledCopyButton onClick={handleCopy}>
            <CopyFileIcon fontSize="small" />
          </StyledCopyButton>
        </Tooltip>
      </Stack>
      {checkIfGlitched() && (
        <Alert
          severity="info"
          sx={{
            mt: 3,
            background: 'rgba(255, 96, 247, 0.18) !important',
            border: '1px solid #FF60F7 !important',
          }}
          title="Glitched traits in this NFT"
          description="Some of the traits in this NFT are glitched, which could influence its value."
        />
      )}
    </CardHeader>
  );
};

export default Header;
