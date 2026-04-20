import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE,
});

const getHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

export async function sendLetterApi(token, content, recipientId) {
    const response = await api.post('/letters', 
        { content, recipientId },
        { headers: getHeaders(token) }
    );
    return response.data;
}

export async function fetchMailboxApi(token) {
    const response = await api.get('/letters/mailbox', { headers: getHeaders(token) });
    return response.data;
}

export async function fetchExploreUsersApi(token, country = '') {
    const response = await api.get(`/explore/users?country=${country}`, { headers: getHeaders(token) });
    return response.data;
}

export async function fetchSuggestionsApi(token) {
    const response = await api.get('/match/suggestions', { headers: getHeaders(token) });
    return response.data;
}

export async function fetchInboxApi(token) {
    const response = await api.get('/letters/inbox', { headers: getHeaders(token) });
    return response.data;
}

export async function fetchSentApi(token) {
    const response = await api.get('/letters/sent', { headers: getHeaders(token) });
    return response.data;
}

export async function fetchInTransitApi(token) {
    const response = await api.get('/letters/in-transit', { headers: getHeaders(token) });
    return response.data;
}
