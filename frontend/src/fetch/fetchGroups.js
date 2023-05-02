import { buildQueryString } from "../utils/QueryStringBuilder";
import fetchApi from "../utils/fetchApi";

export const getGroups = async (queryparams) => {
    const queryString = buildQueryString(queryparams);
    const response = await fetchApi(`/groups${queryString}`, {
        credentials: 'include',
    });
    if (!response.ok) throw response;
    return response.json();
};
  
export const getGroup = async (groupId) => {
    const response = await fetchApi(`/groups/${groupId}`, {
        credentials: 'include',
    });
    if (!response.ok) throw response;
    return await response.json();
};