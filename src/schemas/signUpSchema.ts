import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character");


export const passwordValidation = z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,"Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character")

      
export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Please enter valid email address"}),
    // password:z.string().min(6,{message:"password must be atleast 6 characters"})
    password:passwordValidation
})