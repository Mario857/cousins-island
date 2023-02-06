import terraUtils from './terra-utils';

type ContractName = 'marketplace' | 'lua-power' | 'luart';

const addresses = {
  'phoenix-1': {
    marketplace: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
    'lua-power': 'terra1xkykdx76kxyjwqs3j0wpgjywkhmhp3swfmsdzm',
    luart: 'terra1vwz7t30q76s7xx6qgtxdqnu6vpr3ak3vw62ygk',
  },
  'pisco-1': {
    marketplace: 'terra1r0zwdkn5cvqtcpjulqdku6juhdkedcaa2l2gvz',
    'lua-power': 'terra1s6kp590lh66kat73zlxg3y3va9990p4mnnxuek', // TODO: replace with the correct one later
    luart: 'terra16wvd4hkqw388y8kff9g535gtr4th6zxj48trpn',
  },
};

async function getContractAddress(contractName: ContractName): Promise<string> {
  const networkId = terraUtils.getNetworkId();
  return addresses[networkId][contractName];
}

export default {
  getContractAddress,
};
