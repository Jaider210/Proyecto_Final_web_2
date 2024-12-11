const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { validateOrder } = require('../middlewares/validation');

router.post('/checkout',validateOrder, orderController.createOrder);
router.get('/admin/orders', orderController.getOrders);
router.get('/admin/orders/export', orderController.exportOrders);


module.exports = router;
