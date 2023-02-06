import { NFTTokenDetails, TxReceipt } from '../../blockchain.interface';
import luartCdn, { CollectionMetadata } from '../luart-cdn';
import terraUtils from '../terra-utils';
import _ from 'lodash';

const LIMIT = 30;
const MAX_REQUESTS_PER_CONTRACT = 5;

async function getTokensOnWalletForUserInCollection(
  nftContractAddress: string,
  startAfterTokenId?: string
) {
  const collectionMetadata = await luartCdn.fetchCollectionMetadata(
    nftContractAddress
  );
  const userAddress = await terraUtils.getWalletAddress();

  const tokenIds = await getTokenIdsOwnedByUserWithOffset(
    nftContractAddress,
    userAddress,
    startAfterTokenId
  );

  return tokenIds.map((tokenId) => ({
    ...collectionMetadata[tokenId],
    nftContractAddress,
  }));
}

async function transferToken(
  nftContractAddress: string,
  tokenId: string,
  userAddress: string
): Promise<TxReceipt> {
  return await terraUtils.postTransaction({
    contractAddress: nftContractAddress,
    message: {
      transfer_nft: {
        token_id: tokenId,
        recipient: userAddress,
      },
    },
  });
}

async function getTokensOnWalletForUser() {
  const nftCollections = await luartCdn.getRegisteredCollections();
  const nftAddresses = nftCollections.map(
    (collection) => collection.nftContractAddress
  );
  const userAddress = await terraUtils.getWalletAddress();

  const allTokensOnWallet = [];

  for (const nftAddress of nftAddresses) {
    try {
      const collectionMetadata = await luartCdn.fetchCollectionMetadata(
        nftAddress
      );
      const tokens = await getTokensOwnedByUser(
        nftAddress,
        userAddress,
        collectionMetadata
      );
      allTokensOnWallet.push(...tokens);
    } catch (e) {
      console.warn(e);
    }
  }

  return allTokensOnWallet;
}

async function getTokensOwnedByUser(
  nftContractAddress: string,
  userAddress: string,
  collectionMetadata: CollectionMetadata
): Promise<NFTTokenDetails[]> {
  const tokenIds = await getTokenIdsOwnedByUser(
    nftContractAddress,
    userAddress
  );
  const tokens = [];

  for (const tokenId of tokenIds) {
    const tokenDetails = collectionMetadata[tokenId];
    tokenDetails.nftContractAddress = nftContractAddress;
    tokens.push(tokenDetails);
  }

  return tokens;
}

// We currently return max 150 token ids for a user
async function getTokenIdsOwnedByUser(
  nftContractAddress: string,
  userAddress: string
): Promise<string[]> {
  const allOwnedTokensIds = [];
  let finished = false,
    startAfter,
    counter = 0;

  while (!finished) {
    counter++;
    if (counter > MAX_REQUESTS_PER_CONTRACT) {
      finished = true;
    } else {
      const tokenIds = await getTokenIdsOwnedByUserWithOffset(
        nftContractAddress,
        userAddress
      );

      allOwnedTokensIds.push(...tokenIds);
      if (tokenIds.length < LIMIT) {
        finished = true;
      } else {
        startAfter = tokenIds[tokenIds.length - 1]; // last token received id
      }
    }
  }

  return _.uniq(allOwnedTokensIds);
}

async function getTokensOwnedByUserCountInCollection(
  nftContractAddress: string
): Promise<number> {
  const userAddress = await terraUtils.getWalletAddress();

  const tokenIds = await getTokenIdsOwnedByUserWithOffset(
    nftContractAddress,
    userAddress
  );

  return tokenIds ? tokenIds.length : 0;
}

async function getTokenIdsOwnedByUserWithOffset(
  nftContractAddress: string,
  userAddress: string,
  startAfterTokenId?: string
): Promise<string[]> {
  // console.log(nftContractAddress);
  // console.log(userAddress);

  const response = await terraUtils.sendQuery(nftContractAddress, {
    tokens: {
      limit: LIMIT,
      owner: userAddress,
      start_after: startAfterTokenId,
    },
  });

  // Unstables: Guardians of Terra returns different data
  if (response.ids) {
    return response.ids;
  }

  // Terrans returns different data
  if (response.tokens?.[0]?.token_id) {
    return response.tokens.map((token: any) => token.token_id);
  }

  return response.tokens;
}

async function getOwnerOfToken(
  nftContractAddress: string,
  tokenId: string
): Promise<string> {
  const response = await terraUtils.sendQuery(nftContractAddress, {
    owner_of: {
      token_id: tokenId,
    },
  });

  return response.owner;
}

async function getTokenMetadataFromBlockchain(
  nftContractAddress: string,
  tokenId: string
): Promise<any> {
  const response = await terraUtils.sendQuery(nftContractAddress, {
    nft_info: { token_id: tokenId },
  });

  return response;
}

export default {
  getTokensOnWalletForUserInCollection,
  getTokensOnWalletForUser,
  getTokensOwnedByUserCountInCollection,
  getOwnerOfToken,
  transferToken,
  getTokenMetadataFromBlockchain,
};
