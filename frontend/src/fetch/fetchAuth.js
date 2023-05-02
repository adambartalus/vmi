import fetchApi from "../utils/fetchApi";

const LOGIN_API = '/auth/login';
const LOGOUT_API = '/auth/logout';
const SIGNUP_API = '/auth/register';
const GOOGLE_AUTH_API = '/auth/google-auth';

export const googleLogin = async (credential) => {
  return fetchApi(GOOGLE_AUTH_API, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      google_token: credential,
    }),
  });
};

export const login = async (username, password) => {
  return fetchApi(LOGIN_API, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: username,
      password: password,
    }),
  });
};

export const logout = async () => {
  return fetchApi(LOGOUT_API, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const signup = async (email, password, confirm_password) => {
  const response = await fetchApi(SIGNUP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password,
      confirm_password: confirm_password,
    }),
  });
  if (!response.ok) throw response;
  return response;
};

export const refresh = async () => {
  const response = await fetchApi('/auth/refresh', {
    credentials: 'include',
  });
  if (!response.ok) throw response;
  return response;
};

export const changePassword = async (data) => {
  const response = await fetchApi('/auth/change-password', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw response;
  return response;
};
