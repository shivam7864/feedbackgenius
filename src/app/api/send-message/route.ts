import dbConnect from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/options";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
import mongoose from "mongoose";
import UserModel, { Message } from "@/model/User";

export const POST = async(request:Request) =>{
    const {username,content} = await request.json();
    
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return NextResponse.json({success:false,message:"User not found"},{status:404})
        }
        // is user accepting messages
        if(!user.isAcceptingMessage){
            return NextResponse.json({success:false,message:"User is not accepting messages"},{status:403})
        }
        const newMessage = {content,createdAt:new Date()};
        user.messages.push(newMessage as Message)
        await user.save()
        return NextResponse.json({success:true,message:"Message Sent Successfully"},{status:200})
    } catch (error) {
        console.error("Error adding messages",error);
        return NextResponse.json({success:false,message:"Internal server error"},{status:500})
    }
}