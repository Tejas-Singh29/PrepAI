const express = require('express')
const authController=require('../controllers/auth.controller')

const authRouter = express.Router();

authRouter.post("/register", authController.registerUserController)
authRouter.post('/login', authController.loginUserController)
authRouter.post('/logout', authController.logoutUserController)

module.exports = authRouter