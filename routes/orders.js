const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust if your DB file is named differently

// Render order filter form
router.get('/', async (req, res) => {
    res.render('orders', { title: 'Orders', orders: null });
});

// Handle form submission to query orders
router.post('/', async (req, res, next) => {
    const { startDate, endDate } = req.body;

    try {
        const [orders, fields] = await db.promise().query(
            'SELECT * FROM orders WHERE orderDate BETWEEN ? AND ? ORDER BY orderDate DESC',
            [startDate, endDate]
        );

        console.log(orders); // 👀 Check what it returns

        res.render('orders', { title: 'Orders', orders });
    } catch (err) {
        next(err);
    }
});

// View a specific order
router.get('/:orderNumber', async (req, res, next) => {
    const { orderNumber } = req.params;
    try {
        const [orders, ordersFields] = await db.promise().query(
            'SELECT * FROM orders WHERE orderNumber = ?',
            [orderNumber]
        );
        const order = orders[0];

        const [orderDetails, orderDetailsFields] = await db.promise().query(
            'SELECT * FROM orderdetails WHERE orderNumber = ?',
            [orderNumber]
        );
        const orderDetail = orderDetails[0];

        const [cutomers, customersFields] = await db.promise().query(
            'SELECT * FROM customers WHERE customerNumber = ?',
            [order.customerNumber]
        );
        const customer = cutomers[0];

        res.render('orderDetail', {
            title: `Order #${orderNumber}`,
            order,
            orderDetails,
            customer,
        });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
