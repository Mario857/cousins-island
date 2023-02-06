import axios from 'axios';
import _ from 'lodash';
import { ListedTokens } from './contracts/marketplace';
import terraUtils from './terra-utils';
import registeredNftCollections from './registered-nft-collections';
import {
  CollectionsVolumes,
  LatestTransactionDetails,
  LatestTransactionsQuery,
} from '../blockchain.interface';
import { getTokenDetails } from '.';
import { getAxiosCancelToken } from 'utils/getAxiosCancelToken';

const MARKETPLACE_START = 1640908800000; // 2021-12-31
const NFT_PRICE_INDEXER_URL =
  'https://cosin-island-marketplace-prices-indexer.2ue2d8tpif5rs.eu-central-1.cs.amazonlightsail.com';
const LUART_API_URL = 'https://djvzj74megrb0.cloudfront.net';

// TODO: implement this function in luart-api module
async function getLuaPowerBalance(): Promise<number> {
  throw 'TODO: implement';
}

// TODO: implement this function in luart-api module
async function getLuaPowerRanking(): Promise<number> {
  throw 'TODO: implement';
}

async function getLatestMarketplaceTransactions(
  filter: LatestTransactionsQuery
): Promise<LatestTransactionDetails[]> {
  // Prepare request params
  const mongoQuery = {
    transactionType: { $in: filter.type },
    nftContractAddress: filter.nftContractAddress,
    ...(filter.additionalMongoQuery || {}),
  };
  const encodedQuery = window.btoa(JSON.stringify(mongoQuery));

  const params = {
    filter: encodedQuery,
    limit: filter.limit,
    skip: filter.offset,
  };
  const networkId = terraUtils.getNetworkId();

  // Wait max 10 seconds for response
  const cancelToken = getAxiosCancelToken(10000);

  // Fetching
  const response = await axios.get(
    `${LUART_API_URL}/${networkId}/transactions`,
    { params, cancelToken }
  );


  // Extracting result
  const txsFormatted: LatestTransactionDetails[] = [];
  for (const tx of response.data.txs) {
    const terraFinderUrl = await terraUtils.getTerraUrlForTxId(
      tx.transactionHash
    );
    const nftContractAddress = tx.nftContractAddress;
    const tokenId = tx.nftTokenId;
    const tokenDetails = await getTokenDetails(nftContractAddress, tokenId);

    txsFormatted.push({
      timestamp: tx.timestamp,
      terraFinderUrl,
      tokenDetails,
      price: tx.amountUST + tx.amountLUNA, // a small hack (only one of amounts is non-zero)
      currency: tx.amountUST > 0 ? 'UST' : 'LUNA', // another small hack
      buyer: tx.buyerAddress,
      seller: tx.sellerAddress,
      type: tx.transactionType,
    });
  }

  return txsFormatted;
}

async function getListedTokens(
  nftContractAddress: string
): Promise<ListedTokens> {
  const response = await axios.get(
    `${NFT_PRICE_INDEXER_URL}/nft-collection-prices/${nftContractAddress}`
  );
  return response.data.prices || {};
}

async function getFloorPriceInCollection(
  nftContractAddress: string
): Promise<number> {
  const response = await axios.get(
    `${NFT_PRICE_INDEXER_URL}/nft-collection-prices/${nftContractAddress}`
  );
  const prices = Object.values(response.data.prices || {})
    .filter((el: any) => el.sellPriceCurrency == 'LUNA')
    .map((el: any) => el.sellPriceAmount);

  return _.min(prices) || 0;
}

async function getAvgDailyVolumeInCollection(
  nftContractAddress: string
): Promise<number> {
  const networkId = terraUtils.getNetworkId();
  const collectionDetails = (registeredNftCollections[networkId] as any).find(
    (c: any) => c.nftContractAddress == nftContractAddress
  );
  if (!collectionDetails) {
    return 0;
  } else {
    const totalLunaVolume = await getTotalVolumeInCollection(
      nftContractAddress
    );
    const collectionListingDuration = getCollectionListingDuration(
      collectionDetails.marketplaceListingStart
    );
    const listingDurationDays = collectionListingDuration / (24 * 3600 * 1000);
    return Math.min(totalLunaVolume / listingDurationDays, totalLunaVolume);
  }
}

async function getLast24hVolumeInCollection(nftContractAddress: string): Promise<number> {
  const toDate = new Date().getTime(); // current time
  const fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getTime(); // 24 hours ago

  const networkId = terraUtils.getNetworkId();

  const response = await axios.get(
    `${LUART_API_URL}/${networkId}/volume/${nftContractAddress}`,
    {
      params: {
        from: fromDate,
        to: toDate
      }
    }
  );

  return response.data.uluna;
}

async function getTransactionsForUser(query: LatestTransactionsQuery) {
  const userAddress = await terraUtils.getWalletAddress();

  const txs = await getLatestMarketplaceTransactions({
    ...query,
    additionalMongoQuery: {
      $or: [
        { transactionSender: userAddress },
        { buyerAddress: userAddress },
        { sellerAddress: userAddress },
      ],
    },
  });

  return {
    latestTransactions: txs,
    currentOffset: (query.offset || 0) + query.limit,
  };
}

// Get transactions for token ID
async function getTransactionsForToken(
  query: LatestTransactionsQuery,
  tokenId: string
) {
  const txs = await getLatestMarketplaceTransactions({
    ...query,
    additionalMongoQuery: {
      nftTokenId: tokenId,
    },
  });

  return {
    latestTransactions: txs,
    currentOffset: (query.offset || 0) + query.limit,
  };
}

// Returns value in milliseconds
function getCollectionListingDuration(collectionListingStart: number): number {
  const curTime = Date.now();
  if (collectionListingStart > curTime || !collectionListingStart) {
    return curTime - MARKETPLACE_START;
  } else {
    return curTime - collectionListingStart;
  }
}

async function getTotalVolumeInCollection(
  nftContractAddress: string,
): Promise<number> {
  const networkId = terraUtils.getNetworkId();
  const response = await axios.get(
    `${LUART_API_URL}/${networkId}/volume/${nftContractAddress}`
  );
  return response.data.uluna;
}

async function getCollectionsVolumes(): Promise<CollectionsVolumes> {
  try {
    const networkId = terraUtils.getNetworkId();

    // Wait max 5 seconds for response
    const cancelToken = getAxiosCancelToken(5000);

    const response = await axios.get(`${LUART_API_URL}/${networkId}/volume`, { cancelToken });

    return response.data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export default {
  getLuaPowerBalance,
  getLuaPowerRanking,
  getListedTokens,
  getFloorPriceInCollection,
  getAvgDailyVolumeInCollection,
  getTotalVolumeInCollection,
  getLatestMarketplaceTransactions,
  getTransactionsForUser,
  getCollectionsVolumes,
  getTransactionsForToken,
  getLast24hVolumeInCollection
};
