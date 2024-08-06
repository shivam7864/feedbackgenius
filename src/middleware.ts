import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware"


export const middleware = async(request:NextRequest) =>{
    const token = await getToken({req:request,secret: process.env.NEXTAUTH_SECRET_KEY});
    const url = request.nextUrl;

    if(token && (
        url.pathname.startsWith('/signin') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/verify')
        // url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL('/dashboard',request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/signin',request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
