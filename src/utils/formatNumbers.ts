import numeral from 'numeral';

export const formatInteger = (num?: number) => {
  if (!num) num = 0;

  return numeral(num).format('0,0');
};

export const formatDecimal = (num?: number, decimalPlaces?: number) => {
  if (decimalPlaces === undefined) decimalPlaces = 2;
  if (!num) num = 0;

  const [integer, decimal] = num.toFixed(decimalPlaces).toString().split('.');

  return numeral(integer).format('0,0') + `${decimal ? `.${decimal}` : ''}`;
};
