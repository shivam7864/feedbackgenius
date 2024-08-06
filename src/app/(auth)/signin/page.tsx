'use client'
import {useRouter } from 'next/navigation'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
// import axios, {AxiosError} from 'axios'
import { useToast } from '@/components/ui/use-toast'
// import { ApiResponse } from '@/types/ApiResponse'
import { Form,FormMessage,FormLabel,FormItem,FormField,FormControl} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import {signIn, useSession} from 'next-auth/react'
import { User } from 'next-auth'

const Signin = () => {
    const {data:session} = useSession();
    const user = session?.user as User
    const router =useRouter();
    const {toast} = useToast()
    if(user){
        router.replace('/')
    }
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })

    const onSubmit = async(data:z.infer <typeof signInSchema>) =>{
        const result = await signIn('credentials',{
            redirect:false,
            identifier:data.identifier,
            password:data.password
        })

        if(result?.error){
            
            if(result.error == 'CredentialsSignIn'){
                // alert("JEJJE")
                toast({
                    title:"Login Failed",
                    description:"Incorrect username or password",
                    variant:"destructive"
                })
            }else{
                // alert("KKKKKKK")
                toast({
                    title:"Error Logging in",
                    description:result.error,
                    variant:"destructive"
                })
            }
            
        }
        if(result?.url){
            router.replace('/dashboard');
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Log In</h1>
                <p className="mb-4">Enter your details to login.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email/Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Email/Username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <Button type="submit">Login</Button>
                </form>
                </Form>
        </div>
    </div>
  )
}

export default Signin
