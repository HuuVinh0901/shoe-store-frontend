import { fetchData, postData, putData, patchData } from './apiService';

export const fetchUserInfoById = async (id) => {
    const data = await fetchData(`users/${id}`);
    return data;
};

export const updateUserInfo = async (id, user) => {
    const endpoint = `users/update/${id}`;
    const data = await putData(endpoint, user);
    return data;
};

export const getCustomers = async (page = 1, size = 12) => {
    const data = await fetchData(`users/customers?page=${page}&size=${size}`);
    return data;
};

export const createCustomer = async (user) => {
    const data = await postData('users/customers', user);
    return data;
};

export const searchUsers = async (keyword, page = 1, size = 12) => {
    const data = await fetchData(`users/search?keyword=${keyword}&page=${page}&size=${size}`);
    return data;
};

export const getDeliveredOrdersCount = async (id) => {
    const data = await fetchData(`users/${id}/delivered-orders-count`);
    return data.data === null ? 0 : data.data;
};

export const getTotalAmountByUserId = async (id) => {
    const data = await fetchData(`users/${id}/total-amount`);
    return data.data === null ? 0 : data.data;
};

export const updateUserStatus = async (id, status) => {
    const endpoint = `users/${id}/status`;
    const data = await patchData(endpoint, status);
    return data;
};