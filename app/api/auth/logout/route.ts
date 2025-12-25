import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json(
            {
                success: true,
                message: 'Logout berhasil!',
            },
            { status: 200 }
        )

        // Clear token dari cookies
        response.cookies.set('token', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })

        return response
    } catch (error: any) {
        console.error('❌ Logout error:', error.message || error)

        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan saat logout',
            },
            { status: 500 }
        )
    }
}
