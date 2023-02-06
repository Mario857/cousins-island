// import { NFTCollectionDetails } from './blockchain/blockchain.interface';
import isUserOnStageMarketplace from "./isUserOnStageMarketplace";

const getLiveCollections = (
  collections:
    | any[] // NFTCollectionDetails[]
    | null
) => {
  if (!collections) return [];

  const showUpcomingProjects = isUserOnStageMarketplace;

  const currentTimestamp = new Date().getTime();

  const liveCollections = collections.filter(
    (collection) => collection.marketplaceListingStart <= currentTimestamp || showUpcomingProjects
  );

  return liveCollections;
};

export default getLiveCollections;
