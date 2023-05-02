import { buildQueryString } from '../utils/QueryStringBuilder';
import fetchApi from '../utils/fetchApi';

export const getUsers = async (queryparams) => {
  const queryString = buildQueryString(queryparams);
  const response = await fetchApi(`/users${queryString}`, {
    credentials: 'include',
  });
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};
export const getActiveUsers = async () => {
  return await getUsers({ active: true });
};

export const getUser = async (userId) => {
  const response = await fetchApi(`/users/${userId}`, {
    credentials: 'include',
  });
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};
export const putUser = async ({userId, data}) => {
  const response = await fetchApi(`/users/${userId}`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw response;
  return response.json();
};
export const patchUser = async (userId, data) => {
  const response = await fetchApi(`/users/${userId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw response;
  return response;
}
export const getUserData = async () => {
  const response = await fetchApi(`/auth/user`);
  if (!response.ok) throw response;
  return await response.json();
};
