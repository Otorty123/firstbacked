const JWT = require("jsonwebtoken");
// const User = require("../models/User.model");
const user = require("../Model/User")
// const Token = require("../models/Token.model");
// const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemaier = require("nodemailer");
const passport = require("passport");
const { modelNames } = require("mongoose");

const bcryptSalt =("bcryptSalt") ;
// const clientURL = ;

const requestPasswordReset = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.name, link: link },
      "./template/requestResetPassword.handlebars"
    );
    return link;
  } catch (error) {
    console.error("Error in requestPasswordReset:", error.message);
    throw error;
  }
};

const resetPassword = async (userId, token, password) => {
  try {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }

    const hash = await bcrypt.hash(password, Number(bcryptSalt));

    await User.updateOne({ _id: userId }, { $set: { password: hash } });

    sendEmail(
      passwordResetToken.email,
      "Password Reset Successfully",
      {
        name: passwordResetToken.name,
      },
      "./template/resetPassword.handlebars"
    );

    await passwordResetToken.deleteOne();

    return true;
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    throw error;
  }
};

const SignUp = async (res,req)=>{
  const {username, email, password} = req.body
  if(!username){
    return res.json({error: "username is required"})
  }
  if(!email){
    return res.json({error:"email is required"})
  }
  if(!password){
    return res.json({error:"password is required"})
  }
  const existingUser = await Usermodel.findOne({email});
  if(existingUser){
    return res.json({error:"user already exist"})
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
  const newUser = new Usermodel({
    email:email,
    username:username,
    password:hashedPassword
  })
  Usermodel.register(newUser, password, function(err){
    if(err){
      console.log(err);
    }
    passport.authenticate("local")(req,res, function(err){
      res.json({msg:"Signed In Successfully"})
    })
  })
}


module.exports = {
 SignUp
}