const isUserOnStageMarketplace =
  window.location.href.includes('stage.cousinplace.io') ||
  window.location.href.includes('localhost');

export default isUserOnStageMarketplace;
