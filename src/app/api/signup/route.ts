import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationCode"
import { NextResponse } from "next/server"

export const POST = async(request:Request)=>{
    await dbConnect();

    try {
        const {username,email,password} = await request.json();
        const existingUserVerificationByUsername = await UserModel.findOne({username,isVerified:true});
        if(existingUserVerificationByUsername){
            return NextResponse.json({success:false,message:"Username already taken"},{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({email:email});
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({success:false.valueOf,message:"User already exists with this email.Please try with a different email"},{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserByEmail.password=hashedPassword,
                existingUserByEmail.verifyCode=verifyCode,
                existingUserByEmail.verifyCodeExpiry=expiryDate,
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            let newUserDetails = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUserDetails.save();
            
        }  
        
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return NextResponse.json({success:false.valueOf,message:emailResponse.message},{status:500})
        }
        return NextResponse.json({success:false.valueOf,message:"User registered successfully"},{status:200})
    } catch (error) {
        console.error("Error registering user",error);
        return NextResponse.json({success:false,message:"Error registering user"},{status:500})
    }
}