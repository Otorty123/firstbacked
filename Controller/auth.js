const JWT = require("jsonwebtoken");
const User = require("../models/User.model");
const Token = require("../models/Token.model");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const axios = require('axios')

SECRET_KEY = process.env.SECRET_KEY

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
const verifyPayment = async

