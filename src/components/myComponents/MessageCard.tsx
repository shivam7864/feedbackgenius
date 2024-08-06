'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { useToast } from '../ui/use-toast';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import format from 'date-fns/format';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`)
        toast({ title: response.data.message });
        onMessageDelete(message._id);
    }

    const formattedDate = format(new Date(message.createdAt), "MMM dd, yyyy hh:mm a");

    return (
        <div>
            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm card-bordered">
                <CardHeader className='flex flex-col space-y-1.5 p-6'>
                    <CardContent className='flex justify-between items-center'>
                        <CardTitle className='text-2xl font-semibold'>{message.content}</CardTitle>
                        <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="destructive" className='ml-4'>
                                <X />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    message and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
                        
                </CardHeader>
                <CardFooter>{formattedDate}</CardFooter>
            </Card>
        </div>

       
    )
}

export default MessageCard


