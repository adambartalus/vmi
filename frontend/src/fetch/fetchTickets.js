import { buildQueryString } from '../utils/QueryStringBuilder';
import fetchApi from '../utils/fetchApi';

export const verifyPassByQrCode = async (qrCode) => {
  const response = await fetchApi('/verify-pass', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qr_code: qrCode,
    }),
  });
  if(!response.ok) throw response;
  return response;
}

export const getPasses = async (valid) => {
  const response = await fetchApi(`/passes?valid=${valid}`, {
    credentials: 'include',
  });
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};

export const getPass = async (passId) => {
  const response = await fetchApi(`/passes/${passId}`, {
    credentials: 'include',
  });
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
};

export const getPassTypes = async (queryparams) => {
  const queryString = buildQueryString(queryparams);
  const response = await fetchApi(`/pass-types${queryString}`);
  if (!response.ok) throw response;
  return await response.json();
};

export const postTicketType = async ({ name, validFor, price, purchasable, visitLimit }) => {
  const response = await fetchApi('/pass-types', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      valid_for: validFor,
      price,
      purchasable,
      visit_limit: visitLimit,
    }),
  });
  if (!response.ok) throw response;
  return response;
};

export const postTicket = async ({ userId, ticketTypeId, validFrom, validTo }) => {
  const response = await fetchApi('/passes', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner: userId,
      gym_pass_type: ticketTypeId,
      valid_from: validFrom,
      valid_to: validTo,
    }),
  });
  if (!response.ok) throw response;
  return response;
};
