import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth(); // Use the login function from context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true); // Set loading state to true when the request starts
        try {
            const response = await axios.post("http://localhost:4001/api/user/login", {
                email: data.email,
                password: data.password
            }, { withCredentials: true });

            console.log("Login response:", response.data);
            login(response.data.user, response.data.token);  // Save the user and token
            
            // Redirect to the home/dashboard page after login
            navigate('/dashboard'); // Adjust the path as needed

        } catch (error) {
            console.error("Full error object:", error);
            console.error("Login failed:", error.response?.data?.message || "Server error");
            alert("Login failed: " + (error.response?.data?.message || "Server error"));
        } finally {
            setLoading(false); // Reset the loading state after the request
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="border px-6 py-4 rounded-md space-y-4 w-95">
                <h1 className="text-blue-800 font-bold text-3xl text-center">Treasure Tracker</h1>
                <h2 className="text-xl text-center">
                    <span className="text-blue-800 font-semibold">Login</span> with your Account
                </h2>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        className="border rounded-md p-2 w-full"
                        placeholder="Email"
                        autoFocus
                        {...register('email', { required: "Email is required" })}
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                </div>

                {/* Password */}
                <div>
                    <input
                        type="password"
                        className="border rounded-md p-2 w-full"
                        placeholder="Password"
                        {...register('password', { required: "Password is required" })}
                    />
                    {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
                </div>

                {/* Login Button */}
                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-slate-700 py-2 px-4 rounded-md w-full disabled:opacity-50"
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
