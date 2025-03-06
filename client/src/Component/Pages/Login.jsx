import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post('https://propeers.onrender.com/api/auth/login', {
                email: data.email,
                password: data.password,
            });

            if (response.data) {
                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/profile');
                }, 2000); // Redirect after 2 seconds
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response) {
                // Handle specific error messages from the server
                if (err.response.status === 401) {
                    toast.error("Invalid email or password.");
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

    return (
        <div className="relative flex items-top border justify-center min-h-[550px] bg-white sm:items-center sm:pt-0">
            <ToastContainer />
            <form className="p-6 flex flex-col items-center justify-center min-w-[400px]" onSubmit={handleSubmit(handleLogin)}>
                <div className="flex flex-col mt-2 w-full">
                    <label htmlFor="email" className="hidden">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        id="email"
                        placeholder="Email"
                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col mt-2 w-full">
                    <label htmlFor="password" className="hidden">
                        Password
                    </label>
                    <input
                        type="password"
                        {...register('password', { required: true })}
                        id="password"
                        placeholder="Password"
                        className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-700 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg mt-3 transition ease-in-out duration-300"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="flex mt-4 gap-2 justify-start w-full">
                    <p>Don't have an account?</p>
                    <Link to='/register'>
                        <span className='text-blue-700 font-semibold'>Register</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}