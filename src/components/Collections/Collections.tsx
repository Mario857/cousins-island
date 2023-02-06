import React from 'react';
import Grid from '@mui/material/Grid';
import { NFTCollectionDetails } from 'utils/blockchain/blockchain.interface';
import CollectionCard from 'components/CollectionCard/CollectionCard';
import Alert from 'components/Alert/Alert';
import Typography from '@mui/material/Typography';
import { SwiperSlide } from 'swiper/react';
import CardsSwiper from 'components/CardsSwiper/CardsSwiper';
import getLiveCollections from 'utils/getLiveCollections';

interface CollectionsProps {
  collections?: NFTCollectionDetails[] | null;
  display?: 'grid' | 'carousel';
  error?: boolean;
}

const Collections: React.FC<CollectionsProps> = ({
  collections,
  display = 'grid',
  error = false,
}) => {
  if (error) {
    return (
      <Alert
        severity="error"
        title="Something went wrong"
        description="Collections could not be displayed. Please come back later."
      />
    );
  }

  if (!collections || (collections && collections.length <= 0)) {
    return (
      <Typography variant="body3" color="text.primary">
        We don't have any collections for you at the moment. Please come back
        later.
      </Typography>
    );
  }

  const liveCollections = getLiveCollections(
    collections
  ) as NFTCollectionDetails[];

  if (display === 'grid') {
    return (
      <Grid container spacing={4}>
        {liveCollections.map(
          (collection) =>
            !collection.isHidden && (
              <Grid
                item
                xs={12}
                md={4}
                lg={3}
                key={`collection-${collection.title}`}
              >
                <CollectionCard collection={collection} />
              </Grid>
            )
        )}
      </Grid>
    );
  }

  return (
    <CardsSwiper dataLength={liveCollections.length}>
      {liveCollections.map(
        (collection) =>
          !collection.isHidden && (
            <SwiperSlide key={`collection-slide-${collection.title}`}>
              <CollectionCard collection={collection} />
            </SwiperSlide>
          )
      )}
    </CardsSwiper>
  );
};

export default Collections;
