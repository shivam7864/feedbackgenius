'use client'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import axios, {AxiosError} from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Form,FormMessage,FormLabel,FormItem,FormField,FormControl} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const VerifyAccount = () => {
    const router =useRouter();
    const params = useParams<{username:string}>()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
    })

    const onSubmit = async(data:z.infer <typeof verifySchema>) =>{
        try {
            const response = await axios.post('/api/verifyCode',{
                username:params.username,
                code:data.code
            });
            // let response = await fetch("http://localhost:3000/api/signup", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(data),
            // });   
            
            toast({
                title:'Success',
                description:response.data.message,
            })
            router.replace('/signin');
        } catch (error) {
            console.error("Error in signup of user",error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ;
            toast({
                title:"Verification Failed",
                description:errorMessage,
                variant:"destructive"
            })  
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                <p className="mb-4">Enter the verification code send on your registered email address.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Verification Code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Verify</Button>
                </form>
                </Form>
        </div>
    </div>
  )
}

export default VerifyAccount
