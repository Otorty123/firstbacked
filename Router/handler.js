const express = require('express')
const { SignUp } = require('../Controller/auth')

const router = express.Router()

router.route("/signup").post(SignUp)


module.exports = router