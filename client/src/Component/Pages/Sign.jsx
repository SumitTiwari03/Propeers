import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Sign() {
    const { register, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)
    const history = useNavigate()
    const Registeration = async (data) => {
        try {
          setLoading(true);
          const res = await axios.post('/api/auth/register', {
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            password: data.password,
          });
      
          const resData = res.data;
          console.log("Response data:- ",resData);
      
          // Profile creation
          await axios.post('/api/profile/post', {
            userId: resData.userId, // Use the userId returned from registration
            personalInfo: {
              username: resData.username,
              email: resData.email,
            },
            socialLinks: {}, // Can be empty or from the form if available
            tecnicalSkill: [], // Can be empty or from the form if available
          });
      
          console.log("User registered and profile created");
          setLoading(false);
        //   history('/login');
        } catch (err) {
          console.error("Error while registration or profile creation:", err);
          setLoading(false);
        }
      };
      
    return (
        <>
            <div className="relative flex items-top border justify-center min-h-[550px] bg-white sm:items-center sm:pt-0">
                <form className="p-5 flex flex-col items-center justify-center min-w-[400px]" onSubmit={handleSubmit(Registeration)}>
                    <div className="flex flex-col mt-2 w-full">
                        <label htmlFor="username" className="hidden">
                            Username
                        </label>
                        <input
                            type="text"
                            {...register('username')}
                            id="username"
                            placeholder="Username"
                            className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col mt-2 w-full">
                        <label htmlFor="fullname" className="hidden">
                            Fullname
                        </label>
                        <input
                            type="fullname"
                            {...register('fullname')}
                            id="fullname"
                            placeholder="Fullname"
                            className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col mt-2 w-full">
                        <label htmlFor="email" className="hidden">
                            Email 
                        </label>
                        <input
                            type="email"
                            {...register('email')}
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
                            {...register('password')}
                            id="password"
                            placeholder="Password"
                            className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col mt-2 w-full">
                        <label htmlFor="Confirm pass" className="hidden">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register('Confirmpass')}
                            id="Confirmpass"
                            placeholder="Confirm Password"
                            className="w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className=" w-full bg-orange-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-orange-600 transition ease-in-out duration-300"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="flex mt-4 gap-2 justify-start w-full">
                        <p>Already a user</p>
                        <Link to='/login'>
                            <span className='text-blue-700 font-semibold'> Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );

}