const signupValidation_1 = require('../middlewares/SingupValidations/SignupValidation_1');
const OTPbhejna = require('../controllers/signupControllers/OTPbhejna');
const SignupValidation_2 = require('../middlewares/SingupValidations/SignupValidation_2');
const verifyOTP = require('../middlewares/SingupValidations/VerifyOTP');
const Signup = require('../controllers/signupControllers/FinalSignup');
const loginValidation = require('../middlewares/LoginValidations/LoginValidation');
const login = require('../controllers/loginControllers/Login');
const EmailValidation = require('../middlewares/LoginValidations/RecoveryValidation');
const Send_rcvry_otp = require('../controllers/loginControllers/Send_Rcvry_otp');
const Verify_recovery_OTP = require('../middlewares/LoginValidations/Verify_recovery_otp');
const Set_Up_New_Pass = require('../controllers/loginControllers/NewPass');


const AuthRouter = require('express').Router();

AuthRouter.post('/signup',signupValidation_1,SignupValidation_2,OTPbhejna);
AuthRouter.post('/signup/otpverify',verifyOTP,Signup);

AuthRouter.post('/login',loginValidation,login);
AuthRouter.post('/login/passRecovery',EmailValidation,Send_rcvry_otp);
AuthRouter.post('/login/otpverify',Verify_recovery_OTP);
AuthRouter.post('/login/reset_pass',Set_Up_New_Pass);

module.exports = AuthRouter;