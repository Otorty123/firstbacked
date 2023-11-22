require("dotenv").config()
const nodemailer = require('nodemailer')

const sendmail = async (req, res)=>{
    try{
        const{ name, email, subject, message} = req.body;

        const transport = nodemailer.createTransport({
            service: "Gmail",
            auth:{
                user:process.env.email,
                pass:process.env.password,
            },
        });
        const mailOption = {
            from : process.env.email,
            to: "winohisreal@gmail.com",
            subject: subject || 'contact form submission',
            text:`Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
        await transport.sendMail(mailOption);
        res.json({msg:'Contact form submitted successfully'})
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:'server error'});
    }
}
module.exports = {
    sendmail,
}