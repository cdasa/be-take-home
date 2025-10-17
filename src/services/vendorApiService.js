const axios = required('axios');
const axiosRetry = require('axios-retry').default;
const API_KEY = process.env.VENDOR_API_KEY;
const BASE_URL = process.env.VENDOR_BASE_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'x-api-key' : API_KEY}
});

axiosRetry(apiClient, {
    retries: 3,
    retruDelay: axiosRetry.exponentialDelay,
    retruConditions: (error) => {
        return error.response?.status >= 500 || !error.response;
    }
});

async function getStocks(nextToken = null) {
    let url = '/stocks';
    if (nextToken) {
        url += '?nextToken=${nextToken}';
    }

    const response = await apiClient.get(url);
    return response.data.data;
}

async function buyStock(symbol, price, quantity) {
    const response = await apiClient.post('/stocks/${symbol}/buy', {price, quantity});
    return response.data;
}

async function getAllStocks() {
    let allStocks = [];
    let nextToken = null;

    do {
        const page = await getStocks(nextToken);
        allStocks = allStocks.concat(page.items);
        nextToken = page.nextToken;
    } while (nextToken);

    return allStocks;
}

module.exports ={ getAllStocks, buyStock, getStocks};