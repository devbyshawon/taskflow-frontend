import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect (() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard')
        }        
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Log In</h2>
                
                {error && <p className='text-red-500 mb-4 text-sm'>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Email</label>
                        <input 
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='you@example.com'
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium mb-1'>Password</label>
                        <input 
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Min 6 characters'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'  
                    >
                        {loading ? 'Logging in...' : 'Log In'}                       
                    </button>
                </form>

                <p className='mt-4 text-sm text-center'>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/signup')}
                        className='text-blue-600 cursor-pointer hover:underline'
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );

};

export default LoginPage;