import numeral from 'numeral';
import big, { BigSource } from 'big.js';

export const UST_MAX_DECIMAL_POINTS = 6;
export const LUNA_MAX_DECIMALS_POINTS = 6;

export const toDecimal = (
  num: BigSource,
  decimalPoints: number = 2
): string => {
  const decimalNum = big(
    big(num)
      .mul(10 ** decimalPoints)
      .toFixed()
      .split('.')[0]
  ).div(10 ** decimalPoints);

  return decimalNum.toString();
};

export const formatDecimal = (num: BigSource) => {
  let decimalNum = toDecimal(num);

  const [integer, decimal] = decimalNum.split('.');

  return numeral(integer).format('0,0') + `${decimal ? `.${decimal}` : '.00'}`;
};

export const formatUSTDecimal = (num: BigSource) =>
  `${formatDecimal(num)} $UST`;

export const formatLUNADecimal = (num: BigSource) =>
  `${formatDecimal(num)} $LUNA`;

export const formatLUARTDecimal = (num: BigSource) =>
  `${formatDecimal(num)} $COUSIN`;
