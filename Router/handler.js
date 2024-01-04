const express = require('express')
const { SignUp, Login } = require('../Controller/auth')
const {fundWallet, getTransaction} = require('../Controller/WalletControler')
const { sendmail } = require('../Controller/controller')
const router = express.Router()

router.route("/signup").post(SignUp)
router.route("/login").post(Login)
router.route("/fund-wallet").post(fundWallet)
router.route("/get-trans").get(getTransaction)
router.route('/send-message').post(sendmail)


module.exports = router