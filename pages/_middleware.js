import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';


export async function middleware(req) {

    // token exists if user is logged in
    const token = await getToken({ 
                                req, 
                                secret: process.env.JWT_SECRET,
                                secureCookie:
                                    process.env.NEXTAUTH_URL?.startsWith("https://") ??
                                !!process.env.VERCEL_URL, 
                                raw: true,
                                });

    // this grabs the url, from which it is coming
    const { pathname } = req.nextUrl

    // if user is already signedin, but goes to login page, redirect to home page
    if(token && pathname === '/login'){
        return NextResponse.redirect('/');
    }

    //if user wants to sign in
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }
    
    //redirect to login if there is no token, and user is requesting a protected route
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login');
    }
}