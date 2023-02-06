import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CollectionLogo from 'components/CollectionLogo/CollectionLogo';
import { DiscordIcon, GlobeIcon, TwitterIcon } from 'theme/icons';
import * as ROUTES from 'constants/routes';
import TypographyLink from 'components/TypographyLink/TypographyLink';
import ExclusiveMark from 'components/ExclusiveMark/ExclusiveMark';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import Box from '@mui/material/Box';
import { StyledDescription } from './CollectionDetails.styled';
import { formatDecimal } from 'utils/formatNumbers';

interface AboutCollectionProps {
  previousQuery: string;
}

const CollectionDetails: React.FC<AboutCollectionProps> = ({
  previousQuery,
}) => {
  const { collection } = useSelector((state: State) => state.token);

  const { title, description, totalTokensCount, imageURL, nftContractAddress } =
    collection!;

  const socialLinks = [
    {
      icon: <TwitterIcon fontSize="small" />,
      href: collection?.socialLinks?.twitter,
    },
    {
      icon: <DiscordIcon fontSize="small" viewBox="-2 -2 24 24" />,
      href: collection?.socialLinks?.discord,
    },
    {
      icon: <GlobeIcon fontSize="small" />,
      href: collection?.socialLinks?.website,
    },
  ];

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <CollectionLogo src={imageURL} alt="Collection Logo" size="small" />
        <div>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TypographyLink
              variant="h300"
              color="text.primary"
              underline="hover"
              to={`${ROUTES.COLLECTIONS}/${nftContractAddress}${
                previousQuery || ''
              }`}
            >
              {title}
              <ExclusiveMark
                isExclusive={Boolean(collection?.isExclusive || false)}
              />
            </TypographyLink>
          </Stack>
          <Typography
            variant="body2"
            color="text.primary"
            component="p"
            mt={1 / 2}
          >
            {formatDecimal(totalTokensCount, 0)} items
          </Typography>
        </div>
      </Stack>
      <StyledDescription>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </StyledDescription>
      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
        {socialLinks.map(
          (link, index) =>
            link.href &&
            link.href.length > 1 && (
              <a
                href={link.href}
                target="_blank"
                key={`collection-social-link-${index}`}
              >
                {link.icon}
              </a>
            )
        )}
      </Stack>
    </Box>
  );
};

export default CollectionDetails;
