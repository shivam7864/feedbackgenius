import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";

export const POST = async(request:Request) =>{
    await dbConnect();

    //it will check for currently logged in user
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return NextResponse.json({success:false,message:"Not authenticated"},{status:401})
    }
    const userId = user._id;
    const {acceptMessages} = await request.json();
    

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true});
        if(!updatedUser){
            return NextResponse.json({success:false,message:"Failed to update user status to accept messages"},{status:401})
        }
        return NextResponse.json({success:true,message:"Message acceptance status updated successfully",updatedUser},{status:200})
    } catch (error) {
        console.error("Failed to update user status to accept messages.");
        return NextResponse.json({success:false,message:"Failed to update user status to accept messages"},{status:500})
        
    }
}

export const GET = async(request:Request) =>{
    await dbConnect();

    //it will check for currently logged in user
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    

    if(!session || !session.user){
        return NextResponse.json({success:false,message:"Not authenticated"},{status:401})
    }
    const userId = user._id;
    
    try {
        const foundUser = await UserModel.findById(userId)
        
        if(!foundUser){
            return NextResponse.json({success:false,message:"User not found"},{status:404})
        }

        return NextResponse.json({success:true,isAcceptingMessages:foundUser.isAcceptingMessage},{status:200})
    } catch (error) {
        console.error("Error in getting message acceptance status.");
        return NextResponse.json({success:false,message:"Error in getting message acceptance status."},{status:500})
    }

}