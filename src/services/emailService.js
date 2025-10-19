const nodemailer = require('nodemailer');
const Transaction = require('../models/Transaction');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hayley.zemlak12@ethereal.email',
        pass: 'VG25EvPRTnqw1zhNSh'
    }
});

async function sendDailyReport(isCron = false) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() +1);

        const transactions = await Transaction.find({
            timestamp: { $gte: today, $lt: tomorrow}
        });

        const successful = transactions.filter(t => t.status === 'success').length;
        const failed = transactions.filter(t => t.status === 'failed').length;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "Daily Stock Transaction Report",
            text: `Successful transactions: ${successful}\nFailed transactions: ${failed}\n\nDetails:\n${JSON.stringify(transactions, null, 2)}`
        };

        if (!isCron) {
            const emailInfo = await transporter.sendMail(mailOptions);
            console.log('Daily report sent');
            return emailInfo;
        } else {
            await transporter.sendMail(mailOptions);
            console.log('Daily report sent');
        }
        

    } catch (error) {
        console.error("Error sending daily report: ", error);
    }
}

module.exports = { sendDailyReport }