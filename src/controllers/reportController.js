const { sendDailyReport } = require('../services/emailService');
const nodemailer = require('nodemailer');

/**
 * @swagger
 * /reports/send:
 *   get:
 *     summary: Trigger daily transaction report email
 *     description: Sends a daily report email summarizing transactions and returns the status with an Ethereal preview URL.
 *     responses:
 *       200:
 *         description: Daily report sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Daily report sent successfully
 *                 previewUrl:
 *                   type: string
 *                   example: https://ethereal.email/message/...
 *       500:
 *         description: Failed to send daily report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to send daily report
 */
async function triggerDailyReport(req, res) {
    try {
        const emailInfo = await sendDailyReport();

        res.json({
            success: true,
            message: "Daily report successfully sent!",
            emailPreviewUrl: nodemailer.getTestMessageUrl(emailInfo)
        });
    } catch (error) {
        console.error('triggerDailyReport error:', error.message, error);
        res.status(500).json({
            success: false,
            error: 'Failed to send daily report'
        });
    }
}

module.exports = { triggerDailyReport };