const express = require('express')
const { SignUp } = require('../Controller/auth')
const {fundWallet, getTransaction} = require('../Controller/WalletControler')

const router = express.Router()

router.route("/signup").post(SignUp)
router.route("/fund-wallet").post(fundWallet)
router.route("/get-trans").get(getTransaction)

module.exports = router