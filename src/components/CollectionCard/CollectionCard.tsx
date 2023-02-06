import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import {
  StyledLogoContainer,
  StyledCard,
  StyledBannerPlaceholder,
} from './CollectionCard.styled';
import CollectionLogo from 'components/CollectionLogo/CollectionLogo';
import * as ROUTES from 'constants/routes';
import Stack from '@mui/material/Stack';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';
import blockchain from 'utils/blockchain/real/luart-api';
import { Link } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';
import { formatLUNADecimal } from 'utils/currency';
import { formatDecimal } from 'utils/formatNumbers';
import Tooltip from '@mui/material/Tooltip';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { useEffect, useState } from 'react';

export type CollectionCardProps = {
  collection: NFTCollectionDetails;
};

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const {
    imageURL,
    nftContractAddress,
    totalTokensCount,
    title,
    bannerImageURL,
    volume,
    isExclusive,
  } = collection;
  const [floorPrice, setFloorPrice] = useState(0);
  const getFloorPrice = async () => {
    if (nftContractAddress != null) {
      const floorPrice = await blockchain.getFloorPriceInCollection(
        nftContractAddress
      );

      setFloorPrice(floorPrice);
    }
  };

  useEffect(() => {
    getFloorPrice();
  }, []);

  const details = [
    {
      label: 'Items',
      value: formatDecimal(totalTokensCount, 0),
    },
    {
      label: 'Floor price',
      value: formatLUNADecimal(floorPrice || 0),
    },
    {
      label: 'Total volume',
      value: formatLUNADecimal(volume?.uluna || 0),
    },
  ];

  return (
    <Link to={{ pathname: `${ROUTES.COLLECTIONS}/${nftContractAddress}` }}>
      <Fade in={true}>
        <StyledCard>
          {bannerImageURL ? (
            <CardMedia
              component="img"
              height="152"
              image={bannerImageURL}
              alt="Collection Banner"
            />
          ) : (
            <StyledBannerPlaceholder />
          )}
          <CardContent>
            <StyledLogoContainer>
              <CollectionLogo
                src={imageURL}
                alt="Collection Logo"
                size="large"
              />
            </StyledLogoContainer>

            <Stack direction="row" alignItems="center" mt={4} mb={2}>
              <Tooltip title={title.length > 17 ? title : ''} arrow>
                <Typography
                  variant="h400"
                  component="h5"
                  color="text.primary"
                  noWrap
                >
                  {title}
                </Typography>
              </Tooltip>
              <ExclusiveMark isExclusive={Boolean(isExclusive)} />
            </Stack>

            {details.map((detail, index) => (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: index !== details.length - 1 ? 1 / 2 : 0 }}
                key={`collection-${title}-detail-${index}`}
              >
                <Typography variant="body2" color="text.primary">
                  {detail.label}
                </Typography>
                <Typography
                  variant="h200"
                  color="text.primary"
                  component="h6"
                  noWrap
                >
                  {detail.value}
                </Typography>
              </Stack>
            ))}
          </CardContent>
        </StyledCard>
      </Fade>
    </Link>
  );
};

export default CollectionCard;
