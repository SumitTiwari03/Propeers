import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_URL;


export default function Sign() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    
    const password = watch('password');

    const Registeration = async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(`${baseUrl}/api/auth/register`, {
                fullname: data.fullname,
                username: data.username,
                email: data.email,
                password: data.password,
            });

            const resData = res.data;
            console.log("Response data:- ", resData);

            // Profile creation
            await axios.post(`${baseUrl}/api/profile/post`, {
                userId: resData.userId,
                personalInfo: {
                    username: resData.username,
                    email: resData.email,
                },
                socialLinks: {},
                technicalSkill: [],
            });

            console.log("User registered and profile created");
            toast.success("Registration successful! Please check your email to verify your account.");
            setTimeout(() => {
                toast.info("Redirecting to login page...");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }, 3000);
        } catch (err) {
            console.error("Error while registration or profile creation:", err);
            if (err.response) {
                if (err.response.status === 409) {
                    toast.error("Email or username already exists.");
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="w-full max-w-md px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-gray-500 mt-2">Join us today and get started</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(Registeration)} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...register('username', { 
                                        required: 'Username is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Username must be at least 3 characters'
                                        },
                                    })}
                                    id="username"
                                    placeholder="Choose a username"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...register('fullname', { 
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Full name must be at least 2 characters'
                                        }
                                    })}
                                    id="fullname"
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                            </div>
                            {errors.fullname && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    id="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', { 
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message: 'Password must contain uppercase, lowercase and number'
                                        }
                                    })}
                                    id="password"
                                    placeholder="Create a password"
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="Confirmpass" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('Confirmpass', { 
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    id="Confirmpass"
                                    placeholder="Confirm your password"
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.Confirmpass && (
                                <p className="mt-1 text-sm text-red-600">{errors.Confirmpass.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-orange-600 hover:text-orange-700 font-semibold transition"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}