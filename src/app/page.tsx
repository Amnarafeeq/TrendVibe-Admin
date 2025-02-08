"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Mail, Lock } from "lucide-react"; // Importing Lucide Icons

const AdminLogin = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        if (email === "trendvibe@gmail.com" && password === "trendvibe456") {
            localStorage.setItem("isLoggedIn", "true")
            router.replace("/admin/dashboard")
        } else {
            alert("Invalid email or password")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#252B42] to-[#23856D]">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-[#252B42] mb-6 text-center">Admin Login</h2>
                
                {/* Email Input */}
                <div className="relative mb-4">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#737373]" size={20} />
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="w-full pl-12 p-3 border border-[#737373] rounded-lg bg-[#FAFAFA] text-black outline-none focus:ring-2 focus:ring-[#23A6F0]"
                    />
                </div>

                {/* Password Input */}
                <div className="relative mb-4">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#737373]" size={20} />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="w-full pl-12 p-3 border border-[#737373] rounded-lg bg-[#FAFAFA] text-black outline-none focus:ring-2 focus:ring-[#23A6F0]"
                    />
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full p-3 bg-[#2DC071] text-white font-semibold rounded-lg hover:bg-[#23856D] transition duration-300"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default AdminLogin
