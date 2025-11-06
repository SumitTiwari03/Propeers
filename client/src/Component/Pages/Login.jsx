import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Send } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            setShowResendVerification(false); // Hide resend if showing
            
            const response = await axios.post('https://propeers-07w5.onrender.com/api/auth/login', {
                email: data.email,
                password: data.password,
            });

            if (response.data) {
                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Invalid email or password.");
                } else if (err.response.status === 403) {
                    // Email not verified
                    toast.error("Please verify your email first.");
                    setShowResendVerification(true);
                    setUserEmail(data.email);
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            setResendLoading(true);
            await axios.post('https://propeers-07w5.onrender.com/api/auth/resend-verification', {
                email: userEmail,
            });
            
            toast.success("Verification email sent! Please check your inbox.");
            setShowResendVerification(false);
        } catch (err) {
            console.error("Resend verification error:", err);
            if (err.response?.status === 400) {
                toast.info("Email is already verified. Try logging in.");
                setShowResendVerification(false);
            } else {
                toast.error("Failed to send verification email. Please try again.");
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="w-full max-w-md px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Please login to your account</p>
                    </div>

                    {/* Resend Verification Alert */}
                    {showResendVerification && (
                        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-800 mb-2">
                                        Email Not Verified
                                    </p>
                                    <p className="text-xs text-orange-700 mb-3">
                                        Please verify your email to login. Check your inbox for the verification link.
                                    </p>
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50 transition"
                                    >
                                        <Send className="w-4 h-4 mr-1" />
                                        {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                                        }
                                    })}
                                    id="password"
                                    placeholder="Enter your password"
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

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="text-orange-600 hover:text-orange-700 font-semibold transition"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}