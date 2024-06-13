const express = require('express');
const { forgotpassword, resetpassword } = require('../controller/authcontroller');

const router = express.Router();

router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:token', resetpassword);

module.exports = router;