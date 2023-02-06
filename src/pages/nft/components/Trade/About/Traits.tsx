import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  StyledAccordion,
  StyledDescriptionWrapper,
  StyledTrait,
} from './Traits.styled';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { AngleDownIcon } from 'theme/icons';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { State } from 'store/store';
import queryString from 'query-string';
import * as ROUTES from 'constants/routes';
import { useEffect, useState } from 'react';
import TextButton from 'components/Button/TextButton';
import { toCapitalize } from 'utils/toCapitalize';

interface TraitProps {
  trait: {
    name: string;
    value: string | number;
    rarity: number;
  };
  traitFilterURL: string;
}

const Trait: React.FC<TraitProps> = ({ trait, traitFilterURL }) => {
  return (
    <Link to={trait.rarity > 0 ? traitFilterURL : '#'}>
      <StyledTrait>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={3}
          py={2}
        >
          <div>
            <Typography variant="body2" color="text.secondary" mb="4px">
              {toCapitalize(trait.name || '')}
            </Typography>
            <Typography variant="h200" color="text.primary" component="h6">
              {trait.value}
            </Typography>
          </div>
          {trait.rarity > 0 && (
            <Typography
              variant="h200"
              color="rgba(255, 255, 255, 0.72)"
              component="h6"
            >
              {trait.rarity}%
            </Typography>
          )}
        </Stack>
      </StyledTrait>
    </Link>
  );
};

const Traits = () => {
  const { tokenDetails } = useSelector((state: State) => state.token);

  const traits = tokenDetails?.traits;
  const nftContractAddress = tokenDetails?.nftContractAddress;

  const getFormattedTraits = () => {
    if (traits) {
      return Object.keys(traits).map((key) => ({
        name: key,
        value: traits[key]?.value,
        rarity: traits[key]?.rarity,
      }));
    }
  };

  const formattedTraits = getFormattedTraits();

  const getTraitFilterURL = (traitName: string, traitValue: string) => {
    const query = {
      [`traitFilters[${traitName}]`]: [traitValue],
    };

    const stringifyQuery = queryString.stringify(query);

    const url = `${ROUTES.COLLECTIONS}/${nftContractAddress}?${stringifyQuery}`;

    return url;
  };

  return (
    <>
      <Box px={3} py={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h200" color="text.primary" component="h6">
            Name
          </Typography>
          <Typography variant="h200" color="text.primary" component="h6">
            Rarity
          </Typography>
        </Stack>
      </Box>
      {formattedTraits &&
        formattedTraits.length > 0 &&
        formattedTraits.map(
          (trait, index) =>
            trait.value && (
              <Trait
                key={`nft-trait-${index}`}
                trait={trait}
                traitFilterURL={getTraitFilterURL(trait.name, trait.value)}
              />
            )
        )}
    </>
  );
};

export default Traits;
