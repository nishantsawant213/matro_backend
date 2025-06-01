import crypto from "crypto";

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const  sendOTP = async (mobile, otp) => {
    console.log(`Sending OTP to ${mobile}: ${otp}`);
    // Integrate SMS API (e.g., Twilio, MSG91)
};


export {
    generateOTP,
    sendOTP
  };
  