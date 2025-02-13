"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (email === "trendvibe@gmail.com" && password === "trendvibe456") {
                localStorage.setItem("isLoggedIn", "true")
                toast.success("Login successful!")
                router.replace("/admin/dashboard")
            } else {
                toast.error("Invalid email or password")
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#252B42] to-[#23856D] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo or Brand Name */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">TrendVibe</h1>
                    <p className="text-gray-200">Admin Dashboard</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleLogin}
                    className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 space-y-6"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
                    
                    {/* Email Input */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative"
                    >
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full pl-12 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="relative"
                    >
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full pl-12 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                        />
                    </motion.div>

                    {/* Login Button */}
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-[#2DC071] text-white font-semibold rounded-lg hover:bg-[#23856D] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <span>Login</span>
                        )}
                    </motion.button>

                    {/* Additional Info */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-white/60 text-sm mt-4"
                    >
                        Protected Admin Dashboard
                    </motion.p>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default AdminLogin
