// const { default: axios } = require('axios');
const Transaction = require('../Model/Transaction');
const user = require('../Model/User');
const Wallet = require('../Model/Wallet');




SECRET_KEY = process.env.SECRET_KEY


const fundWallet = async (req, res) => {
    const { user } = req.user;
    const { amount, reference } = req.body;
  
    if (!amount || !reference) {
      return res.status(400).json({ message: 'Reference or amount is missing', success: false });
    }
  
    let wallet = await Wallet.findOne({ user }) || new Wallet({ user, current_balance: 0, previous_balance: 0 });
    const userBalance = wallet.current_balance;
  
    const transaction = new Transaction({
      user: user,
      old_balance: userBalance,
      new_balance: userBalance,
      amount: amount * 100,
      type: 'credit',
      status: 'pending',
      description: `Wallet funding with ${amount * 100}`,
      reference_number: reference,
    });
  
    try {
      const payment = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${SECRET_KEY}` },
      });
  
      const { data } = payment.data;
  
      if (!data.status || data.data.status !== 'success') {
        throw new Error('Paystack payment verification failed');
      }
  
      transaction.external_id = data.data.id;
      transaction.status = 'completed';
    } catch (error) {
      transaction.status = 'failed';
      transaction.description = 'Payment verification failed';
      await transaction.save();
  
      return res.status(422).json({ message: 'Verification failed', success: false });
    }
  
    const amount_paid = amount * 100;
    wallet.previous_balance = userBalance;
    wallet.current_balance = userBalance + amount_paid;
  
    transaction.new_balance = wallet.current_balance;
    await Promise.all([wallet.save(), transaction.save()]);
  
    res.status(200).json({
      message: 'Verification successful',
      status: true,
      data: {
        balance: wallet.current_balance
      },
    });
  };
   // const fundWallet = async (req, res)=>{
//     const user = req.user
//     try{
//         const {email, amount} = req.body;

//         const initResponse = await axios.post(
//             'https://api.paystack.co/transaction/initialize',
//             {email, amount},
//             {headers: {
//                 Authorization: `Bearer ${SECRET_KEY}`,
//             },
//         }
//         );
//         const authorizationUrl = initResponse.data.data.authorization_url;

//         // Step 2: Redirect user to authorization URL
//         res.json({ authorizationUrl });
//     } catch (error) {
//         console.error('Error initializing transaction:', error.message);
//         res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
// }

//  const verifyPayment = async (req, res) => {
//     const user = req.user;
//     const userWallet = user.wallet
//     try {
//       const { reference } = req.params;

//       if(!userWallet){
//         new Wallet({
//             current_balance:0,
//             previous_balance:0
//         })
//       }
  
//       const verifyResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
//         headers: {
//           Authorization: `Bearer ${SECRET_KEY}`,
//         },
//       });
  
//       const paymentStatus = verifyResponse.data.data;
//       if(paymentStatus.status === 'success'){
//         userWallet.current_balance = paymentStatus.amount
//       }
  
//       await res.json({ paymentStatus });
//     } catch (error) {
//       console.error('Error verifying payment:', error.message);
//       res.status(500).json({ status: 'error', message: 'Internal server error' });
//     }
//   };


  const getTransaction = async (req, res)=>{
    const user = req.user;
    const {transaction_id} = req.params;

    const trans = await Transaction.findOne({_id:transaction_id}).populate('user', '_id email username');

    if(!trans){
        res.status(404).json({error: 'not transaction found'})
    }
    return res.json({
        message: "transaction retrieved successfully",
        success: true,
        data: {user: trans.user},
    });
  };



  module.exports = {fundWallet, getTransaction}