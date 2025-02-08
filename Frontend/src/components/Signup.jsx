import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Signup = () => {
    const { setAuthUser } = useAuth();  // Using setAuthUser from context
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();  // Use this for redirect after successful signup

    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', '');

    // Validate that password and confirm password match
    const validatePasswordMatch = (value) => {
        return value === password || "Password and Confirm Password don't match";
    };

    const onSubmit = async (data) => {
        console.log("Data being sent:", data);  // Check the data format
        try {
            const response = await axios.post("/api/user/signup", data, {
                withCredentials: true,  // Ensuring the credentials are sent along with the request
            });
            console.log(response.data);
            alert("Signup Successful! You can login now");

            // Store user and token in the auth context
            setAuthUser({
                user: response.data.user,
                token: response.data.token,
            });

            // Redirect to login page after successful signup
            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Treasure Tracker</h2>
                <h3 className="text-xl text-center mb-6">Create an Account</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold">Full Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-md p-2"
                            placeholder="Enter your full name"
                            {...register('fullName', { required: "Full Name is required" })}
                        />
                        {errors.fullName && <span className="text-red-600 text-sm">{errors.fullName.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-md p-2"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Enter a valid email"
                                }
                            })}
                        />
                        {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            className="w-full border rounded-md p-2"
                            placeholder="Enter your password"
                            {...register('password', { 
                                required: "Password is required", 
                                minLength: { value: 6, message: "Password must be at least 6 characters" } 
                            })}
                        />
                        {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border rounded-md p-2"
                            placeholder="Confirm your password"
                            {...register('confirmPassword', {
                                required: "Confirm Password is required",
                                validate: validatePasswordMatch  // Ensure the function is correctly referenced here
                            })}
                        />
                        {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>}
                    </div>

                    <input type="submit" value="Signup" className="w-full bg-blue-800 text-white py-2 rounded-md cursor-pointer hover:bg-blue-700" />

                    <p className="text-center text-sm mt-4">
                        Already have an account?
                        <Link to="/login" className="text-slate-600 hover:underline ml-1">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
