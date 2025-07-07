const { userTokenAuth } = require('../../middlewares/user');

const router = require('express').Router();


router.use(userTokenAuth);

router.get('/', (req, res) => {
    res.send('Get user cart');
});

router.post('/add', (req, res) => {
    res.send('Add product to cart');
});

router.put('/update/:productId', (req, res) => {
    res.send(`Update product ${req.params.productId} quantity`);
});

router.delete('/remove/:productId', (req, res) => {
    res.send(`Remove product ${req.params.productId} from cart`);
});

router.delete('/clear', (req, res) => {
    res.send('Clear cart');
});

module.exports = router;
