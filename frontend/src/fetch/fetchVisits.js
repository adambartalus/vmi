import fetchApi from '../utils/fetchApi';

export const getVisits = async () => {
  const response = await fetchApi(`/visits`);
  if (!response.ok) throw response;
  return response.json();
};

export const postVisit = async (data) => {
  const response = await fetchApi('/visits', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw response;
  return response;
};

export const patchVisit = async ({ visitId, data }) => {
  const response = await fetchApi(`/visits/${visitId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw response;
  return response;
};
