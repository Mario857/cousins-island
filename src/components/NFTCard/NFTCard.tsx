import Card from 'components/Card/Card';
import { StyledNFTCard } from './NFTCard.styled';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import { NFTTokenDetails } from 'utils/blockchain/blockchain.interface';
import Fade from '@mui/material/Fade';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatDecimal } from 'utils/currency';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import VideoToken from 'components/VideoToken/VideoToken';
import TokenMedia from 'components/TokenMedia/TokenMedia';
import GlitchedMark from 'components/GlitchedMark/GlitchedMark';

interface NFTCardProps {
  token: NFTTokenDetails;
  isExclusive?: boolean;
  showPrice?: boolean;
  isVideo?: boolean;
  glitchedNFTs?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({
  token,
  isExclusive = false,
  showPrice = true,
  isVideo = false,
  glitchedNFTs = false,
}) => {
  const { nftContractAddress, imageURL, tokenId, collectionTitle, name } =
    token;

  const sellPriceAmount = token?.sellPriceAmount;
  const sellPriceCurrency = token?.sellPriceCurrency;

  const location = useLocation();

  if (!isVideo && imageURL?.includes('.mp4')) isVideo = true;

  return (
    <Link
      to={{
        pathname: `${ROUTES.COLLECTIONS}/${nftContractAddress}/${tokenId}`,
        state: {
          query: location.search,
        },
      }}
    >
      <Fade in={true}>
        <StyledNFTCard>
          <Card>
            {!isVideo ? (
              <TokenMedia
                src={imageURL}
                alt={name}
                height="256px"
                width="100%"
              />
            ) : (
              <VideoToken src={imageURL} />
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2, mb: 1, width: '100%' }}
              spacing={1}
            >
              {collectionTitle && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ maxWidth: '80%' }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    noWrap
                    sx={{ lineHeight: '12px !important' }}
                  >
                    {collectionTitle}
                  </Typography>
                  <ExclusiveMark isExclusive={isExclusive} />
                </Stack>
              )}
              {showPrice && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: '12px !important' }}
                >
                  Price
                </Typography>
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="h200"
                component="h6"
                color="text.primary"
                sx={{ maxWidth: showPrice ? '50%' : '100%' }}
                noWrap={!showPrice}
              >
                {name || `#${tokenId}`} {glitchedNFTs && <GlitchedMark />}
              </Typography>
              {showPrice && (
                <>
                  {sellPriceAmount && sellPriceCurrency ? (
                    <Typography
                      variant="h200"
                      component="h6"
                      color="text.primary"
                      sx={{ maxWidth: '50%' }}
                      noWrap
                    >
                      <LazyLoadImage
                        src={
                          sellPriceCurrency === 'LUNA'
                            ? '/images/luna.png'
                            : '/images/ust.png'
                        }
                        alt={sellPriceCurrency}
                        height="16px"
                        width="16px"
                        style={{
                          marginBottom: -3,
                          marginRight: 6,
                        }}
                      />
                      {formatDecimal(sellPriceAmount || 0)}
                    </Typography>
                  ) : (
                    <Typography
                      variant="h200"
                      component="h6"
                      color="text.secondary"
                    >
                      No offers
                    </Typography>
                  )}
                </>
              )}
            </Stack>
            {/* <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h100" color="text.secondary" component="h6">
                Highest offer
              </Typography>
            </Stack> */}
          </Card>
        </StyledNFTCard>
      </Fade>
    </Link>
  );
};

export default NFTCard;
