const User = require('../models/User');

/**
 * @swagger
 * /users/all-users:
 *   get:
 *     summary: List all users
 *     description: Retrieves a list of all users with their portfolios.
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch users
 */
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, 'userId email portfolio');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

module.exports = { getAllUsers };