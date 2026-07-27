    const axios = require('axios');

    const sendOTP = async(email,otp)=>{
        const api = process.env.API_KEY;
        const url = 'https://api.brevo.com/v3/smtp/email';

        const emaildata = {
            sender:{
                name:"LEETRACK",
                email:process.env.EMAIL_USER
            },
            to:[{
                email:email,
            }],
            subject:"OTP FOR LEETRACK SIGNUP",
            htmlContent:`Bhai, tera OTP ye raha: ${otp}. Jaldi daal de!`
        };

        try{
            const response  = await axios.post(url,emaildata,{
                headers:{
                    'Content-Type':'application/json',
                    'api-key':api
                }
            })
        }catch(err){
            console.log(err);
        }
    }

    const send_PassRecovery_OTP = async(email,otp)=>{
        const api = process.env.API_KEY;
        const url = 'https://api.brevo.com/v3/smtp/email';

        const emaildata = {
            sender:{
                name:"LEETRACK",
                email:process.env.EMAIL_USER
            },
            to:[{
                email:email,
            }],
            subject:"OTP FOR LEETRACK PASSWORD RESER",
            htmlContent:`Bhai, tera OTP ye raha: ${otp}. Jaldi daal de!`
        };

        try{
            const response  = await axios.post(url,emaildata,{
                headers:{
                    'Content-Type':'application/json',
                    'api-key':api
                }
            })
        }catch(err){
            console.log(err);
        }
    }

    module.exports = {sendOTP,send_PassRecovery_OTP};