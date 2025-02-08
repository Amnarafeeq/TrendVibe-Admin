"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AdminLogin = () => {
    const [email,setEmail] = useState<string>("")
    const [password,setPassword]= useState<string>("")
    const router = useRouter()

    
    const handleLogin = (e : React.FormEvent)=>{
        e.preventDefault()

        if(email==="amna123@gmail.com" && password ==="amna456"){
          localStorage.setItem("isLoggedIn","true")
          router.push("/admin/dashboard")
        }else{
          alert("Invalid email or password")
        }
    }
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <form onSubmit={handleLogin} className='bg-white p-6 rounded-lg shadow-xl'>
        <h2>Admin login</h2>
        <input type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email} className='w-full p-3 mb-4 border-gray-400 rounded-md'/>
        <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full p-3 mb-4 border-gray-400 rounded-md'/>
        <button type='submit'>Login</button>

      </form>
      
    </div>
  )
}

export default AdminLogin