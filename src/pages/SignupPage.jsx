import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/signup', formData);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
            <div className='bg-white w-full max-w-md rounded-xl shadow-md p-8'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Sign Up</h1>

                {error && <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input 
                            type='text' 
                            name='name' 
                            value={formData.name} 
                            onChange={handleChange}
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Your name'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                        <input 
                            type='email' 
                            name='email' 
                            value={formData.email} 
                            onChange={handleChange}
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='you@example.com'
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <input 
                            type='password' 
                            name='password' 
                            value={formData.password} 
                            onChange={handleChange}
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Min 6 characters'
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading} 
                        className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <p className='mt-4 text-sm text-center'>
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')}
                        className='text-blue-600 font-medium cursor-pointer hover:underline'
                    >
                        Log In
                    </span>
                </p>                        
            </div>
        </div>
    );
};

export default SignupPage;