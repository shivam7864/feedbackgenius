'use client'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth';
import { Button } from '../ui/button';

const Navbar = () => {
    const {data:session} = useSession();
    const user = session?.user as User
    

  return (
    <nav className='p-2 md:p-6 bg-gray-900 text-white shadow-md '>
        <div className='container ms-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:md-0' href='/'>Feedback Genius</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome, <a href='/dashboard'>{user?.username || user?.email}</a></span>
                    <Button className='w-full md:w-auto bg-accent text-black' onClick={()=>signOut()}>Logout</Button>
                    </>
                ) : (
                        <>
                        <div className='flex gap-2'>
                        <Link href='/signin'>
                            <Button className='w-full md:w-auto bg-accent text-black'>Login</Button>
                        </Link>
                        <Link href='/signup'>
                        <Button className='w-full md:w-auto bg-accent text-black'>Signup</Button>
                    </Link>

                        </div>
                        
                        </>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
