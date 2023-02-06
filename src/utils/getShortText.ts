export const getShortText = (
  text: string,
  startCount: number,
  endCount?: number
) => {
  return `${text.slice(0, startCount)}...${text.slice(
    text.length - (endCount || startCount)
  )}`;
};
