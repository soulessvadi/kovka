const express = require('express');
const router = express.Router();
const fs = require('fs');

// Response handling
let response = {};

router.get('/products', (req, res) => {
    let json = fs.readFileSync('server/products.json');
    response = JSON.parse(json);
    res.json(response);
});

module.exports = router;
