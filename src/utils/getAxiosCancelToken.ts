import axios from 'axios';

export const getAxiosCancelToken = (timeout: number) => {
  const source = axios.CancelToken.source();

  setTimeout(() => {
    source.cancel();
  }, timeout);

  return source.token;
}