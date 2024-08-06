'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback} from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form,FormMessage,FormLabel,FormItem,FormField,FormDescription,FormControl} from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsename, setIsCheckingUsename] = useState(false)  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const  router = useRouter();
  const {toast} = useToast()
  const debounced = useDebounceCallback(setUsername,300)
  
  useEffect(() => {
    const checkUsernameUnique = async()=>{
      if(username){
        setIsCheckingUsename(true);;
        setUsernameMessage('');

        // Using AXIOS
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ??"Error checking username")
        }finally{
          setIsCheckingUsename(false);
        }

        // USING FETCH
        // try {
        //   const res = await fetch(`http://localhost:3000/api/check-username-unique?username=${username}`);
        //   let result =await res.json()
          
        //   setUsernameMessage(result.message);
        // } catch (error) {
        //   setUsernameMessage("Error checking username")
        // }finally{
        //   setIsCheckingUsename(false);
        // }
      }
    }
    checkUsernameUnique();
  }, [username])

  const onSubmit = async(data:z.infer <typeof signUpSchema>) =>{
    setIsSubmitting(true);
    console.log(data);
    
    try {
      const response = await axios.post<ApiResponse>('/api/signup',data);
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
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user",error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message ;
      toast({
        title:"Signup failure",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }
  
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Feedback Genius</h1>
          <p className="mb-4">Join us to embark on your anonymous adventure.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} onChange={(e)=>{
                    field.onChange(e);
                    debounced(e.target.value)
                    // setUsername(e.target.value);
                  }}/>
                </FormControl>

                {isCheckingUsename && <Loader2 className='animate-spin'/>}
                  <p className={`text-sm ${usernameMessage ==="Username is available" ? 'text-green-500' :"text-red-500"}`}>{usernameMessage}</p>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field}/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwword</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field}/>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isSubmitting} className='mx-auto'>
            {
              isSubmitting ? (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' >Please Wait</Loader2>
                </>
              ):("Signup")
            }
          </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <span>Already a member?
            <Link href='/signin' className='text-blue-600 hover:text-blue-800'> Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Signup
