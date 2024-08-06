import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export const GET = async(request:Request) =>{
    await dbConnect();

    //it will check for currently logged in user
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    
    if(!session || !session.user){
        return NextResponse.json({success:false,message:"Not authenticated"},{status:401})
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            { $unwind: {
                  "path": "$messages"
            } },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: userId, messages: { $push: "$messages" } } }
        ])
        
        
        if(!user || user.length === 0){
            return NextResponse.json({success:false,message:"User found but with no messages."},{status:404})
        }
        return NextResponse.json({success:false,message:user[0].messages},{status:200})
    } catch (error) {
        console.error("Unexpected Error Occured",error);
        return NextResponse.json({success:false,message:"Unexpected Error Occured"},{status:401})

    }
}