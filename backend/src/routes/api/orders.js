const router = require('express').Router();
const { userTokenAuth } = require('../../middlewares/user');

router.use(userTokenAuth);

router.post('/checkout', (req, res) => {
    res.send('Place order');
});

router.get('/', (req, res) => {
    res.send('Get user orders');
});

router.get('/:id', (req, res) => {
    res.send(`Get details of order ${req.params.id}`);
});

router.put('/:id/cancel', (req, res) => {
    res.send(`Cancel order ${req.params.id}`);
});

module.exports = router;
