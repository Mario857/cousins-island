import terraUtils from './blockchain/real/terra-utils';

const getTerraFinderUrl = (data: string, type = 'address') => {
  const networkId = terraUtils.getNetworkId();

  return `https://finder.terra.money/${networkId}/${type}/${data}`;
};

export default getTerraFinderUrl;
