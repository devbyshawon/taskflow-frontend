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
        <nav className='bg-white shadow px-6 py-4 flex justify-between items-center'>
            
            {/* Left side - app name */}
            <div className='text-xl font-bold text-blue-600 cursor-pointer'
                onClick={() => navigate('/dashboard')}
            >
                TaskFlow
            </div>

            {/* Right side - only show if user exists */}
            {user && (
                <div className='flex items-center gap-4'>
                    {/* show user.name here */}
                    <span className='text-sm text-gray-600 font-medium'>
                        {user.name}
                    </span>

                    {/* show logout button here */}
                    <button 
                        onClick={handleLogout}
                        className='bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600'
                    >
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
};

export default Navbar;