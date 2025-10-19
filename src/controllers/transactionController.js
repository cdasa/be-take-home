const User = require('../models/User');
const Transaction = require('../models/Transaction');
const {buyStock, getAllStocks} = require('../services/vendorApiService');

/**
 * @swagger
 * /transactions/buy:
 *   post:
 *     summary: Purchase a stock
 *     description: Executes a stock purchase, updates user portfolio, and logs the transaction. Price must be within ±2% of current stock price.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, symbol, price, quantity]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user1
 *               symbol:
 *                 type: string
 *                 example: AAPL
 *               price:
 *                 type: number
 *                 example: 1.5
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Stock purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     portfolio:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           symbol:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *       400:
 *         description: Price out of 2% tolerance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Price out of 2% tolerance
 *       404:
 *         description: User or stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Transaction failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Transaction failed
 */
async function purchaseStock(req, res) {
    const {userId, symbol, price, quantity} = req.body;

    try {
        const user = await User.findOne({userId});

        if (!user) {
            return res.status(404).json({error: "User not found!"});
        }

        const stocks = await getAllStocks();

        const stock = stocks.find(s => s.symbol == symbol);

        if (!stock) {
            return res.status(404).json({error: "Stock not found!"});
        }

        const currentPrice = stock.price;
        const tolerance = 0.02*currentPrice;

        if (Math.abs(price - currentPrice) > tolerance) {
            await Transaction.create({ userId, symbol, quantity, price, status: 'failed'});
            return res.status(404).json({error: "Price out of the 2% tolerance range"});
        }

        const result = await buyStock(symbol, price, quantity);
        const status = result.status == 200 ? 'success' : 'failed';

        const existingItem = user.portfolio.find(item =>item.symbol === symbol);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.portfolio.push({ symbol, quantity });
        }

        await user.save();

        await Transaction.create({ userId, symbol, quantity, price, status });

        res.json({ success: true, data: {status, portfolio: user.portfolio}});
    } catch (error) {
        res.status(500).json({error: "Transaction failed"});
    }
}

module.exports = { purchaseStock };