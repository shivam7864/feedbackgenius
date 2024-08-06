'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { NextRequest } from 'next/server'
import React, { useState } from 'react'
import question from "@/questions.json"
import { Toast } from '@/components/ui/toast'



const Message = (request:NextRequest) => {
  const [message, setMessage] = useState('');
  const [questionOne, setQuestionOne] = useState("What's your favorite movie?")
  const [questionTwo, setQuestionTwo] = useState("What's your favorite book?")
  const [questionThree, setQuestionThree] = useState("What's a memorable experience you've had?")
  
  const params = useParams<{username:string}>()

  // Access the username from params
  const username = params.username;


  const handleSubmit = async(e:any) =>{
    e.preventDefault()
    try {
        const response = await axios.post('/api/send-message',{
            username:username,
            content:message
            
        });
        // let response = await fetch("http://localhost:3000/api/signup", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(data),
        // });
        
        
        toast({
            title:'Send',
            description:"Message send successfully",
        })
    } catch (error) {
      
        console.error("Error in signup of user",error);
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message ;
        toast({
            title:"Verification Failed",
            description:"User not found",
            variant:"destructive"
        })  
    }
}

let question_1:string;
let question_2:string;
let question_3:string;

const suggestMessage = ()=>{
  question_1 = question[Math.floor(Math.random() * 159)]
  question_2 = question[Math.floor(Math.random() * 159)]
  question_3 = question[Math.floor(Math.random() * 159)]
  setQuestionOne(question_1);
  setQuestionTwo(question_2)
  setQuestionThree(question_3);
  toast({
    title:"Message updated",
    variant:"default"
  })
}



  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  // Determine if the button should be disabled
  const isButtonDisabled = message.length < 5;

  // Function to handle copying text to the textarea
  const handleSuggestionClick = (text: string) => {
    setMessage(text); 
  };
  


  return (
    <div className='container my-8 mx-auto p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Public Profile Link</h1>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Send Anonymous message</label>
          <Textarea value={message} onChange={handleChange} placeholder="Write your anonymous message here." />
        </div>
        <div className='flex justify-center'>
          <Button type='submit' disabled={isButtonDisabled}>Send it</Button>
        </div>
      </form>

      <div className='space-y-4 my-8'>
        <div className='space-y-2'>
          <Button onClick={suggestMessage}>Suggest Messages</Button>
          <p>Click on any message below to select it.</p>
        </div>

        <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
          <div className='flex flex-col space-y-1.5 p-6'>
            <h3 className="text-xl font-semibold">Messages</h3>
          </div>
          <div className="p-6 pt-0 flex flex-col space-y-4">
            <Button variant="outline" onClick={() => handleSuggestionClick(questionOne)}>
              {questionOne}
            </Button>
            <Button variant="outline" onClick={() => handleSuggestionClick(questionTwo)}>
              {questionTwo}
            </Button>
            <Button variant="outline" onClick={() => handleSuggestionClick(questionThree)}>
              {questionThree}
            </Button>
          </div>
        </div>
        <Separator/>

          <div className='text-center'>
            <div className="mb-4">Get Your Message Board</div>
            <Button><a href='/signup'>Create Your Account</a></Button>
          </div>
      </div>
    </div>
  )
}

export default Message
