const { userTokenAuth } = require('../../middlewares/user');

const router = require('express').Router();

router.use(userTokenAuth);

router.get('/', (req, res) => {
    res.send('Get wishlist items');
});

router.post('/add', (req, res) => {
    res.send('Add product to wishlist');
});

router.delete('/remove/:productId', (req, res) => {
    res.send(`Remove product ${req.params.productId} from wishlist`);
});

module.exports = router;
