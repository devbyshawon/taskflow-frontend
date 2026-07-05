import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <nav className='bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>

            <div className='text-xl font-bold text-blue-600 cursor-pointer'
                onClick={() => navigate('/dashboard')}
            >
                TaskFlow
            </div>

            {user && (
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-600 font-medium'>
                        Hi, {user.name}
                    </span>

                    <button 
                        onClick={handleLogout}
                        className='text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors'
                    >
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
};

export default Navbar;