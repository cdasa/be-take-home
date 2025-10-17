const { getAllStocks } = require('../services/vendorApiService');

async function listStocks(req, res) {
    try {
        const stocks = await getAllStocks();
        res.json({ success: true, data: stocks}) ;
    } catch (error) {
        res.status(500).json({error: "Failed to fetch stocks"});
    }
}

module.exports = {listStocks};