const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require('../middlewares/file.middleware')


const interviewRouter = express.Router()

//generate new interview report on the basis of user self description,resume pdf and job description
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

module.exports = interviewRouter