const express = require('express')
<<<<<<< HEAD
const { SignUp, Login } = require('../Controller/auth')
=======
const { SignUp } = require('../Controller/auth')
const {fundWallet, getTransaction} = require('../Controller/WalletControler')
>>>>>>> c057a0b06e50209cf73d3949b53eb921551d1e86

const router = express.Router()

router.route("/signup").post(SignUp)
<<<<<<< HEAD
router.route("/login").post(Login)

=======
router.route("/fund-wallet").post(fundWallet)
router.route("/get-trans").get(getTransaction)
>>>>>>> c057a0b06e50209cf73d3949b53eb921551d1e86

module.exports = router