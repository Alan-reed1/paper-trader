'use client';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';


export default function RegisterPage(){

 const router = useRouter(); //using the router

  //initialize variables
  const [formData, setFormData] = useState({
    username: '',
    password:'',
  });

  //loggedin??
  const[status, setStatus] = useState('');


  //updates the key values on the go----->{for dynamic future use}
  const handelChange = (e)=>{
   const name = e.target.name;
   const value = e.target.value; 

    setFormData((prev)=>({
      ...prev,
      [name]: value,
    }))
  }

  //Hitting the authentication route
  async function handleSubmit(e) {
    e.preventDefault();

    try{
   const response = await axios.post('/api/auth/register', formData);
   setStatus('Logged in succfullyy');

   const {id, username, timeCreated} = response.data;
   

      router.push('/login');
  }catch(err){
 if(err.message?.staus === 400){
  setStatus('Username already exists');
}else{
  setStatus("Registration failed, please try again");
}
  }
}

    return(
        <>
   <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-dark border border-muted p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col items-center">

          {/* Logo */}
          <Image
            src="/logo.svg"
            alt="VaultQuest Logo"
            width={100}
            height={100}
            className="w-auto h-50"
          />

          {/* Greet */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Create an Account</h2>
            <p className="text-sm text-muted mt-1">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5 mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-background border border-muted text-white placeholder-muted focus:outline-none focus:border-primary"
              value={formData.username}
              onChange={handelChange}
              required
            />
           
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-muted text-white placeholder-muted focus:outline-none focus:border-primary"
              value={formData.password}
              onChange={handelChange}
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-dark font-semibold hover:brightness-110 transition"
            >
              Register
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-6">
            <hr className="flex-1 border-muted" />
            <span className="text-muted text-sm">OR</span>
            <hr className="flex-1 border-muted" />
          </div>

          {/* Social buttons */}
          <div className="w-full grid grid-cols-3 gap-3">
            <div className="h-10 bg-muted rounded-lg w-full" />
            <div className="h-10 bg-muted rounded-lg w-full" />
            <div className="h-10 bg-muted rounded-lg w-full" />
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status && <p className="text-center mt-4 text-muted">{status}</p>}
    </>
        
    )
}