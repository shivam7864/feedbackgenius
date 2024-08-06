import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GithubProvider from "next-auth/providers/github"

export const authOptions:NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify your first first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Please enter valid credentials");
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        }),
        // AppleProvider({
        // clientId: process.env.APPLE_ID,
        // clientSecret: process.env.APPLE_SECRET
        // }),
        // FacebookProvider({
        // clientId: process.env.FACEBOOK_ID,
        // clientSecret: process.env.FACEBOOK_SECRET
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
      // Passwordless / email sign in
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id= user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username= user.username;
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },
    pages:{
        signIn:'/signin'
    },
    session:{
        strategy:"jwt"
    },
    secret : process.env.NEXTAUTH_SECRET_KEY
}