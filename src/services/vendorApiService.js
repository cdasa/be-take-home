const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const API_KEY = process.env.VENDOR_API_KEY;
const BASE_URL = process.env.VENDOR_BASE_URL;

const cache = {
    stocks: null,
    timestamp: null,
    ttl: 300000
};

console.log(cache);

// console.log('Vendor API configuration: ', BASE_URL, 'Key', API_KEY ? 'Set' : 'Missing');

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-api-key' : API_KEY,
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

axiosRetry(apiClient, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryConditions: (error) => {
        console.log('Retry condition check: ', error.response?.status || 'Network error');
        return error.response?.status >= 500 || !error.response;
    }
});

async function getStocks(nextToken = null) {
    let url = '/stocks';
    if (nextToken) {
        url += '?nextToken=' + nextToken;
    }

    try {
        console.log('Fetching stocks from: ', url);
        const response = await apiClient.get(url);
        // console.log('RAW API response: ', response.status, response.data);
        return response.data.data;
    } catch (error) {
        console.error('getStocks error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }

    // const response = await apiClient.get(url);
    // return response.data.data;
}

async function buyStock(symbol, price, quantity) {
    try {
        const config = {
            headers: {
                'x-api-key': API_KEY, // Explicitly set to ensure it's included
                'Content-Type': 'application/json'
            }
        };
        console.log('Sending buy request for ', symbol, ':', { price, quantity, url: `/stocks/${symbol}/buy`, headers: config.headers }); // Detailed debug log
        const response = await apiClient.post(`/stocks/${symbol}/buy`, { price, quantity }, config);
        console.log('Buy stock response:', response.status, response.data);
        return response.data;
    } catch (error) {
        console.error('buyStock error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
}

async function getAllStocks() {
    try {
        const now = Date.now();
        if (cache.stocks && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
            console.log('Returning cached stocks:', cache.stocks.length);

            return cache.stocks;
        }

        console.log("Fetching from API");

        let allStocks = [];
        let nextToken = null;

        do {
            const page = await getStocks(nextToken);
            allStocks = allStocks.concat(page.items);
            nextToken = page.nextToken;
        } while (nextToken);

        cache.stocks = allStocks;
        cache.timestamp = now;

        console.log('All stsocks fetched and cached: ', allStocks.length);
        return allStocks;
    } catch (error) {
        console.error('getAllStocks error:', error.message, error.response?.data); // Detailed error log
        throw new Error('Failed to fetch all stocks');
    }
}

module.exports ={ getAllStocks, buyStock, getStocks};