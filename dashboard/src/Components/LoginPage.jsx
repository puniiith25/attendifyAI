import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/v1/users/login", { email, password }, { withCredentials: true });
            if (res.data.success) {
                if (res.data.user.role === "admin") {
                    navigate('/');

                } else {
                    alert("Access denied: Only admin can access this page");
                }
            } else {
                alert("Login failed: " + res.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong ");
        }

    }

    return (
        <div className='absolute inset-0 z-90 w-full h-full  grid'>
            <form onSubmit={HandleSubmit} className='place-self-center border-2 border-blue-950 w-120 p-8 rounded-2xl'>
                <h1 className='font-bold text text-blue-950 text-4xl'>Attend QR!</h1>
                <div>
                    <h1 className='text-2xl font-semibold text-center text-gray-500 mt-10'>Login</h1>
                </div>

                <div>
                    <p className='ml-1 font-semibold mt-12'>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder='Enter email' className='border-0 bg-gray-200 w-full p-2 mt-1 rounded' />
                </div>
                <div>
                    <p className='ml-1 font-semibold mt-7'>Password</p>
                    <input onChange={(e) => setpassword(e.target.value)} type="password" name="email" placeholder='Enter Password' className='border-0 bg-gray-200 w-full p-2 mt-1 rounded' />
                </div>
                <div className='flex justify-center align-middle pb-15 pt-10'>
                    <button className='border-2 font-semibold text-white text-[20px] text-center p-2 rounded-2xl mt-13 w-[80%] bg-blue-950' type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage