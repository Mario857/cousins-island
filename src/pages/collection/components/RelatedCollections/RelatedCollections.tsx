import { RelatedCollection } from 'utils/blockchain/blockchain.interface';
import React from 'react';
import Stack from '@mui/material/Stack';
import Button from 'components/Button/Button';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import { ArrowRightIcon } from 'theme/icons';

interface RelatedCollectionsProps {
  relatedCollections: RelatedCollection[];
}

const RelatedCollections: React.FC<RelatedCollectionsProps> = ({
  relatedCollections,
}) => {
  return (
    <Stack direction="column" spacing={2} mb={2}>
      {relatedCollections.map((relatedCollection) => {
        const relatedCollectionURL = `${ROUTES.COLLECTIONS}/${relatedCollection.nftContractAddress}`;

        return (
          <Link
            to={relatedCollectionURL}
            key={`relatedCollection-${relatedCollection.nftContractAddress}`}
          >
            <Button
              variant="contained"
              color="tertiary"
              type="button"
              fullWidth
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              endIcon={<ArrowRightIcon viewBox="-3 0 24 24" />}
            >
              {relatedCollection.title}
            </Button>
          </Link>
        );
      })}
    </Stack>
  );
};

export default RelatedCollections;
