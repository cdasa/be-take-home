const User = require('../models/User');

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