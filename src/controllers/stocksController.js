const { getAllStocks } = require('../services/vendorApiService');

/**
 * @swagger
 * /stocks:
 *   get:
 *     summary: List all stocks
 *     description: Retrieves a list of stocks from the vendor API, with in-memory caching for performance.
 *     responses:
 *       200:
 *         description: List of stocks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 *       500:
 *         description: Failed to fetch stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch stocks
 */
async function listStocks(req, res) {
    try {
        const stocks = await getAllStocks();
        res.json({ success: true, data: stocks}) ;
    } catch (error) {
        res.status(500).json({error: "Failed to fetch stocks"});
    }
}

module.exports = {listStocks};