const express = require('express')
const { sendmail } = require('../Controller/controller')
const router = express.Router()


router.route('/send-message').post(sendmail)


module.exports = router