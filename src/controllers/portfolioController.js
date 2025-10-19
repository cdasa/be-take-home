const User = require('../models/User');

/**
 * @swagger
 * /portfolio/{userId}:
 *   get:
 *     summary: Get user portfolio
 *     description: Retrieves the portfolio for a specific user by userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: user1
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
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
 *                     $ref: '#/components/schemas/PortfolioItem'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
async function getPortfolio(req, res) {
    const {userId} = req.params;

    try {
        const user = await User.findOne({ userId });

        if (!user) return res.status(404).json({ error: "User not found"});
        res.json({ success: true, data: user.portfolio });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch portfolio"});
    }
}

module.exports = { getPortfolio };