import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';


export async function middleware(req) {

    // token exists if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    // allow the request if its a request for next-auth session or a token exists
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    } 

    // Redirect to login if there is no token and the user is requesting a protected route
    if (!token && pathname !== '/login' ) {
        return NextResponse.redirect('/login');
    }
}