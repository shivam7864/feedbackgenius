'use client'

const { SessionProvider } = require("next-auth/react")

export default function AuthProvider ({children}:{children:React.ReactNode}){
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}