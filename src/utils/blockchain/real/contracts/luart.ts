import terraUtils from '../terra-utils';
import addresses from '../addresses';

// This module is responsible for standard interactions with the LUART token contract

async function getBalanceLUART(): Promise<number> {
  const address = await terraUtils.getWalletAddress();
  const luaTokenAddress = await addresses.getContractAddress('luart');
  const response = await terraUtils.sendQuery(luaTokenAddress, {
    balance: { address },
  });

  if (!response || !response.balance) {
    throw new Error(
      'Invalid response for COUSIN balance fetching: ' + JSON.stringify(response)
    );
  }

  return terraUtils.amountConverter.luart.blockchainValueToUserFacing(
    response.balance
  );
}

export default {
  getBalanceLUART,
};
