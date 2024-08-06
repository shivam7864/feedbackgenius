
import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse, streamText } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    // Helper function to convert Stream<ChatCompletionChunk> to ReadableStream
    
}


// function streamToReadableStream(stream:any) {
//   const reader = stream.getReader();
//   return new ReadableStream({
//     async pull(controller) {
//       const { done, value } = await reader.read();
//       if (done) {
//         controller.close();
//       } else {
//         controller.enqueue(value);
//       }
//     },
//     cancel() {
//       reader.releaseLock();
//     }
//   });
// }


// try {
//   // Extract the `messages` from the body of the request
//   // const { messages } = await req.json();
//   const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

//   // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.completions.create({
//     model: 'gpt-3.5-turbo-instruct',
//     max_tokens:400,
//     stream: true,
//     prompt
//   });

//   // Convert the response into a friendly text-stream

//   const readableStream = streamToReadableStream(response);
//   // const stream = streamText(readableStream);

//   // Respond with the stream
//   return new StreamingTextResponse(readableStream);

// } catch (error) {
//   if(error instanceof OpenAI.APIError){
//       const {name,status,headers,message} = error;
//       return NextResponse.json({name,status,headers,message},{status:status})
//   }else{
//       console.error('Error:', error);
//       return NextResponse.json({
//           success: false,
//           message: 'Error processing the request',
//         }, { status: 500 });
//   }
  
// }