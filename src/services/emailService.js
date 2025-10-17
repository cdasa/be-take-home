const nodemailer = require('nodemailer');
const Transaction = require('../models/Transaction');
const Transaction = require('../models/Transaction');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendDailyReport() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() +1);

        const Transaction = await Transaction.find({
            timestamp: { $gte: today, $lt: tomorrow}
        });

        const successful = transactions.filter(t => t.status === 'success').length;
        const failed = transactions.filter(t => t.status === 'failed').length;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "Daily Stock Transaction Report",
            text: 'Successful transactions: ${successful}\nFailed transactions: ${failed}\n\nDetails:\n${JSON.stringify(transactions, null, 2)}'
        };

        await transporter.sendMail(mailOptions);
        console.log('Daily report sent');
    } catch (error) {
        console.error("Error sending daily report: ", error);
    }
}

module.exports = { sendDailyReport }