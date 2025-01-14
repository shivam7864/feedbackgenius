import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail (
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        const send = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code for FeedBack Genius',
            react: VerificationEmail({ username,otp:verifyCode }),
          });
          
        return {success:true,message:'Successfully send verification code'}
    } catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {success:false,message:'Failed to send verification code'}
        
    }
}
