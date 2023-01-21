const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
require('dotenv').config()

router.post('/register', authController.register )

router.post('/login', authController.logIn)

router.post('/reset',authController.Reset)

router.post('/reset-password-done', authController.resestPasswordDone)

router.get('/check', authController.getCheck)


module.exports=router;