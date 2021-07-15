const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    res.json('created');
});

module.exports = router;