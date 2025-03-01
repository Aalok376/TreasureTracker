
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:4001/api/user/login", {
                email: data.email,
                password: data.password
            }, { withCredentials: true });

            console.log("Login response:", response.data);
            login(response.data.user, response.data.token);
            toast.success("Login Successful!"); // Show toast after successful login
            navigate('/dashboard'); // Redirect after login

        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || "Server error");
            toast.error(error.response?.data?.message || "Login failed, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} 
                className="bg-white border px-8 py-6 rounded-lg shadow-lg max-w-sm w-full">
                
                <h1 className="text-blue-800 font-bold text-3xl text-center">Treasure Tracker</h1>
                <h2 className="text-xl text-center mt-2 text-gray-700">
                    <span className="text-blue-800 font-semibold">Login</span> with your Account
                </h2>

               
                <div className="mt-4">
                    <input
                        type="email"
                        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Email"
                        autoFocus
                        {...register('email', { required: "Email is required" })}
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                </div>

           
                <div className="mt-4">
                    <input
                        type="password"
                        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Password"
                        {...register('password', { required: "Password is required" })}
                    />
                    {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
                </div>

                
                <div className="mt-4">
                    <button
                        type="submit"
                        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 text-slate py-2 px-4 rounded-md w-full transition duration-200 ease-in-out disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p className="text-center mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-800 underline">SignUp</Link>
                </p>
            </form>
        </div>
    );
}
