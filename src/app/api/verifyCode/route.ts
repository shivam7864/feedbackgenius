// import { useToast } from "@/components/ui/use-toast";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export const POST = async(request:Request)=>{
    await dbConnect();
    try {
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername})
        
        if(!user){ 
            return NextResponse.json({success:false,message:"User not found"},{status:500})
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return NextResponse.json({success:true,message:"Account Verified Successfully"},{status:200})
        }else if(!isCodeNotExpired){

            return NextResponse.json({success:false,message:"Verification code has expired.Please sign up again to get a new verification code"},{status:500})
        }else{
            return NextResponse.json({success:false,message:"Verification code is incorrect.Please try again with a valid code."},{status:500})
        }
    } catch (error) {
        return NextResponse.json({success:false,message:"Error verifying user"},{status:500})
    }

}