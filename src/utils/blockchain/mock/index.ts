import {
  TxReceipt,
  BlockchainModule,
  NFTCollectionDetails,
  TokensQuery,
  NFTTokenDetails,
  NFTTokenTradingDetails,
  TerraCurrency,
  Balance,
  BidRequest,
  Bid,
} from '../blockchain.interface';
import luart from '../real/contracts/luart';
import terraUtils from '../real/terra-utils';
import utils from './utils';

async function getNFTCollections(): Promise<NFTCollectionDetails[]> {
  await utils.sleep();
  return [
    getDefaultNftCollection(1),
    getDefaultNftCollection(2),
    getDefaultNftCollection(3),
  ];
}

async function getNFTCollection(
  nftContractAddress: string
): Promise<NFTCollectionDetails> {
  await utils.sleep();
  return getDefaultNftCollection(1);
}

function getDefaultNftCollection(index: number): NFTCollectionDetails {
  return {
    imageURL:
      'https://pbs.twimg.com/profile_images/1453300993496690690/MLVryiM9_400x400.jpg',
    title: `Hellcats - test ${index}`,
    description:
      'HellCats are randomly generated avatars designed for the Metaverse and beyond. Your Hellcat doubles as your exclusive membership and DAO pass.',
    nftContractAddress: 'terra1haa4ru3khmuccdsdfjyut79mszqrqt7dpuets0',
    totalTokensCount: 2500,
    marketplaceListingStart: 1642693237000,
    possibleTraits: {
      background: [
        { value: 'Red', rarity: 33 },
        { value: 'Blue', rarity: 20 },
        { value: 'Green', rarity: 47 },
      ],
      eyes: [
        { value: 'Blue', rarity: 30 },
        { value: 'Green', rarity: 70 },
      ],
      job: [
        { value: 'Dev at luart.io', rarity: 10 },
        { value: 'Designer at google.com', rarity: 90 },
      ],
    },
  };
}

// Collection page
async function getTokensInCollection(_query: TokensQuery): Promise<{
  tokens: NFTTokenDetails[];
  pagesCount: number;
  totalResults: number;
}> {
  await utils.sleep();
  const tokens = [];
  const pagesCount = 4;

  for (let i = 0; i < 30; i++) {
    tokens.push(getTokenDetailsInternal(String(i)));
  }
  return {
    tokens,
    pagesCount,
    totalResults: 30,
  };
}

async function getTokenDetails(
  _nftContractAddress: string,
  tokenId: string
): Promise<NFTTokenDetails> {
  await utils.sleep();
  return getTokenDetailsInternal(tokenId);
}

function getTokenDetailsInternal(tokenIndex: string): NFTTokenDetails {
  return {
    tokenId: tokenIndex,
    name: `HellCats test #${tokenIndex}`,
    sellPriceAmount: 5,
    sellPriceCurrency: 'LUNA',
    imageURL:
      'https://d3pjy0odfbu86v.cloudfront.net/testnet/terra1haa4ru3khmuccdsdfjyut79mszqrqt7dpuets0/random-images/1114.png',
    nftContractAddress: 'terra1haa4ru3khmuccdsdfjyut79mszqrqt7dpuets0',
    traits: {
      background: { value: 'Blue', rarity: 20 },
      eyes: { value: 'Green', rarity: 70 },
      job: { value: 'Dev at luart.io', rarity: 10 },
    },
  };
}

async function getTokenTradingDetailsForUser(
  _nftContractAddress: string,
  tokenId: string
): Promise<NFTTokenTradingDetails> {
  await utils.sleep();
  const isEvenTokenId = Number(tokenId) % 2 == 0;
  return {
    sellPriceAmount: isEvenTokenId ? 5 : undefined,
    sellPriceCurrency: isEvenTokenId ? 'LUNA' : undefined,
    owner: 'terra1s6kp590lh66kat73zlxg3y3va9990p4mnnxuek',
    sellFees: {
      luartFee: '2.5%',
      royaltyFee: '2.5%',
      txFee: '<2 UST',
    },
    canUserSell: isEvenTokenId,
    canUserBuy: !isEvenTokenId,
    canUserBid: !isEvenTokenId,
    doesUserOwnIt: isEvenTokenId,
  };
}

async function buyNow(
  nftContractAddress: string,
  tokenId: string,
  amount: number,
  currency: TerraCurrency
): Promise<TxReceipt> {
  await utils.sleep();
  return utils.getDefaultMockTxReceipt();
}

async function offerSellPrice(
  nftContractAddress: string,
  tokenId: string,
  amount: number,
  currency: TerraCurrency
): Promise<TxReceipt> {
  await utils.sleep();
  return utils.getDefaultMockTxReceipt();
}

async function cancelSelling(
  nftContractAddress: string,
  tokenId: string
): Promise<TxReceipt> {
  await utils.sleep();
  return utils.getDefaultMockTxReceipt();
}

async function getTokensOnWalletForUserInCollection(): Promise<
  NFTTokenDetails[]
> {
  await utils.sleep();
  return ['1', '2'].map((tokenId) => getTokenDetailsInternal(tokenId));
}

async function getTokensOnWalletForUser(): Promise<NFTTokenDetails[]> {
  await utils.sleep();
  return ['1', '2'].map((tokenId) => getTokenDetailsInternal(tokenId));
}

async function getTokensOwnedByUserCountInCollection(
  nftContractAddress: string
): Promise<number> {
  await utils.sleep();
  return 2;
}

async function getTokensOnSellForUser(): Promise<NFTTokenDetails[]> {
  await utils.sleep();
  return ['3', '4', '5'].map((tokenId) => getTokenDetailsInternal(tokenId));
}

async function getLuaPowerBalance(): Promise<number> {
  await utils.sleep();
  return 123.75;
}

async function getLuaPowerRanking(): Promise<number> {
  await utils.sleep();
  return 45;
}

async function getWithdrawableBalance(): Promise<Balance> {
  await utils.sleep();
  return {
    LUNA: 1,
    UST: 2,
  };
}

async function withdraw(
  amount: number,
  currency: TerraCurrency
): Promise<TxReceipt> {
  await utils.sleep();
  return utils.getDefaultMockTxReceipt();
}

async function getFloorPriceInCollection(
  nftContractAddress: string
): Promise<number> {
  await utils.sleep();
  return 2.4;
}

async function getAvgDailyVolumeInCollection(
  nftContractAddress: string
): Promise<number> {
  await utils.sleep();
  return 140.45;
}

async function getLast24hVolumeInCollection(
  nftContractAddress: string
): Promise<number> {
  await utils.sleep();

  return 70;
}

async function getTotalVolumeInCollection(
  nftContractAddress: string
): Promise<number> {
  await utils.sleep();
  return 2010.5;
}

async function getLatestTransactions() {
  await utils.sleep();
  return [];
}

async function getTransactionsForToken() {
  await utils.sleep();
  return {
    latestTransactions: [],
    currentOffset: 1,
  };
}

async function getTransactionsForUser() {
  await utils.sleep();
  return {
    latestTransactions: [],
    currentOffset: 1,
  };
}

function markNotificationsAsViewed() {
  return 0;
}

function hasUnreadNotifications() {
  return true;
}

async function getNewNotifications() {
  await utils.sleep();
  return {
    notifications: [],
    latestTimestamp: 0,
  };
}

const MOCK_BID = {
  nftContractAddress: 'terra12asdfasdfsa',
  tokenId: '5',
  amount: 50,
  currency: 'LUNA' as TerraCurrency,
  creatorAddress: 'terra1ae9lkzr4kkxp0l6l2vgv7ngderjmzpnlj5zhwm',
  isActive: true,
  bidOrderId: 'bid_order_id_1',
  timestamp: 1645822073000,
  tokenDetails: {
    name: 'Skeleton Punk #2125',
    collectionTitle: 'Skeleton Punks',
    imageURL:
      'https://d1mx8bduarpf8s.cloudfront.net/QmS682Br8wwiXmoW6NxLxcewAiA24R6FTRuniH43pyncJ1',
  },
};

async function postBid(bidRequest: BidRequest): Promise<TxReceipt> {
  await utils.sleep();

  return utils.getDefaultMockTxReceipt();
}

async function cancelBid(bidOrderId: string): Promise<TxReceipt> {
  await utils.sleep();

  return utils.getDefaultMockTxReceipt();
}

async function getAllBidsForToken(
  tokenId: string,
  nftContractAddress: string
): Promise<Bid[]> {
  await utils.sleep();

  const bids = new Array(10).fill(MOCK_BID);

  return bids;
}

async function getAllBidsForUser(address: string): Promise<Bid[]> {
  await utils.sleep();

  const bids = new Array(10).fill(MOCK_BID);

  return bids;
}

async function executeBid(bidOrderId: string): Promise<TxReceipt> {
  await utils.sleep();

  return utils.getDefaultMockTxReceipt();
}

async function depositTokensOnMarketplace(
  amount: number,
  currency: TerraCurrency
): Promise<TxReceipt> {
  await utils.sleep();

  return utils.getDefaultMockTxReceipt();
}

async function transferToken(
  nftContractAddress: string,
  tokenId: string,
  userAddress: string
): Promise<TxReceipt> {
  await utils.sleep();

  return utils.getDefaultMockTxReceipt();
}

async function getTokenMetadataFromBlockchain(
  nftContractAddress: string,
  tokenId: string
): Promise<any> {
  await utils.sleep();

  return {};
}

async function getLunaPrice(): Promise<number> {
  await utils.sleep();
  return 90;
}

async function getCollectionsVolumes() {
  await utils.sleep();
  return {};
}

const mockBlockchainModule: BlockchainModule = {
  // Main page (all collections)
  getNFTCollections,
  getCollectionsVolumes,

  // Collection page
  getNFTCollection,
  getTokensInCollection,
  getFloorPriceInCollection,
  getAvgDailyVolumeInCollection,
  getTotalVolumeInCollection,
  getLast24hVolumeInCollection,

  // NFT token page
  getTokenDetails,
  getTokenTradingDetailsForUser,
  buyNow,
  offerSellPrice,
  cancelSelling,
  transferToken,
  getTokenMetadataFromBlockchain,
  getTransactionsForToken,

  // My account
  getTokensOnWalletForUserInCollection,
  getTokensOnWalletForUser,
  getTokensOwnedByUserCountInCollection,
  getTokensOnSellForUser,
  getLuaPowerBalance,
  getLuaPowerRanking,
  getWithdrawableBalance,
  withdraw,
  getTransactionsForUser,

  // Activity page
  getLatestTransactions,

  // Notifiactions
  getNewNotifications,
  markNotificationsAsViewed,
  hasUnreadNotifications,

  // Bidding
  postBid,
  cancelBid,
  getAllBidsForToken,
  getAllBidsForUser,
  executeBid,
  depositTokensOnMarketplace,

  getBalanceUST: terraUtils.getBalanceUST,
  getBalanceLUNA: terraUtils.getBalanceLUNA,
  getBalanceLUART: luart.getBalanceLUART,

  setWallet: terraUtils.setWallet,

  isTestnet: terraUtils.isTestnet,

  getTxResult: terraUtils.getTxResult,

  getLunaPrice,
};

export default mockBlockchainModule;
