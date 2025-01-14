import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export const GET = async(request:Request)=>{
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);

        const checkUsername = searchParams.get('username')
        const queryParam = {username:checkUsername};

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({success:false,message:usernameErrors?.length>0?usernameErrors.join(', '):'Invalid query parameter'},{status:400})
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return NextResponse.json({success:false,message:"Username is already taken.Try other"},{status:400})
        }
        return NextResponse.json({success:true,message:"Username is available"},{status:200});
    } catch (error) {
        console.error("Error checking username",error);
        return NextResponse.json({success:false,message:"Error checking username"},{status:500});
    }
}