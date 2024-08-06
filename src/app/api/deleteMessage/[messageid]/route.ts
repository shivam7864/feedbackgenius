import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export const DELETE = async(request:Request,{params}:{params:{messageid:string}})=>{
    const messageId = params.messageid;
    await dbConnect();
    //it will check for currently logged in user
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    if(!session || !session.user){
        return NextResponse.json({success:false,message:"Not authenticated"},{status:401})
    }
    try {
        // $pull is a mongodb command to delete a array element which matches with the condition
        const updatedResult = await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:messageId}}});
        if(updatedResult.modifiedCount==0){
            return NextResponse.json({success:false,message:"Message not found or already deleted."},{status:401})
        }
        return NextResponse.json({success:true,message:"Successfully Deleted"},{status:200})
    } catch (error) {
        console.error("Error deleting the message",error);
        return NextResponse.json({success:false,message:error},{status:401})

        
        
    }

}