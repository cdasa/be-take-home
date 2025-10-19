const express = require('express');
const { listStocks } = require('../controllers/stocksController');
const { getPortfolio } = require('../controllers/portfolioController');
const { purchaseStock } = require('../controllers/transactionController');
const {getAllUsers} = require('../controllers/userController');
const {triggerDailyReport} = require('../controllers/reportController');

const router = express.Router();

router.get('/stocks', listStocks);
router.get('/portfolio/:userId', getPortfolio);
router.post('/transactions/buy', purchaseStock);
router.get('/users/all-users', getAllUsers);
router.get('/reports/send', triggerDailyReport);

module.exports = router;