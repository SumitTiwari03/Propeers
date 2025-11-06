import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';


const baseUrl = import.meta.env.VITE_URL;


export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (data) => {
        try {
            setLoading(true);
            await axios.post(`${baseUrl}/api/auth/forgot-password`, {
                email: data.email,
            });

            toast.success("Password reset link has been sent to your email!");
            
            setTimeout(() => {
                toast.info("Redirecting to login page...");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }, 3000);
        } catch (err) {
            console.error("Forgot password error:", err);
            if (err.response) {
                if (err.response.status === 404) {
                    toast.error("Email not found. Please check and try again.");
                } else {
                    toast.error("Failed to send reset link. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="w-full max-w-md px-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Back to Login Link */}
                    <Link 
                        to="/login" 
                        className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to login
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
                        <p className="text-gray-500 mt-2">No worries, we'll send you reset instructions</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-5">
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
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Remember your password?{' '}
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