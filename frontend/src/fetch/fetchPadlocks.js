import { buildQueryString } from '../utils/QueryStringBuilder';
import fetchApi from '../utils/fetchApi';

export const getPadlocks = async (queryparams) => {
  const queryString = buildQueryString(queryparams);
  const response = await fetchApi(`/padlocks${queryString}`);
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};
export const getAvailablePadlocks = async () => {
  const response = await fetchApi('/padlocks?available=true');
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};
export const deletePadlock = async (id) => {
  const response = await fetchApi(`/padlocks/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw response;
  return response;
};
export const postPadlock = async ({ padlockId, text }) => {
  const response = await fetchApi('/padlocks', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      padlock_id: padlockId,
      text,
    }),
  });
  if (!response.ok) throw response;
  return response;
};
export const patchPadlock = async ({ padlock, padlockId, text }) => {
  const response = await fetchApi(`/padlocks/${padlock.id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      padlock_id: padlockId,
      text,
    }),
  });
  if (!response.ok) throw response;
  return response;
};
