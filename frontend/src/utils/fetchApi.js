import { refresh } from '../fetch/fetchAuth';

const { REACT_APP_API_URL } = process.env;
let isRefreshing = false;

const fetchApi = async (url, options = { credentials: 'include' }) => {
  const response = await fetch(`${REACT_APP_API_URL}${url}`, options);

  if (response.status === 401) {
    if (isRefreshing) {
      console.log('Already refreshing');
      return response;
    }
    isRefreshing = true;
    try {
      await refresh();
      const newResponse = await fetch(url, options);
      return newResponse;
    } catch (error) {
      throw new Error('Failed to refresh tokens');
    } finally {
      isRefreshing = false;
    }
  }
  return response;
};

export default fetchApi;
