import { NavLink } from 'react-router-dom';
import { FaCar, FaParking, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <div className="w-64 bg-gray-800 text-white h-screen fixed">
            <div className="p-4 text-xl font-bold">Parking System</div>
            <nav className="mt-6">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `flex items-center p-4 ${isActive ? 'bg-green-600' : 'hover:bg-gray-700'}`}
                >
                    <FaTachometerAlt className="mr-3" />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/vehicles"
                    className={({ isActive }) => `flex items-center p-4 ${isActive ? 'bg-green-600' : 'hover:bg-gray-700'}`}
                >
                    <FaCar className="mr-3" />
                    Vehicles
                </NavLink>
                <NavLink
                    to="/parking"
                    className={({ isActive }) => `flex items-center p-4 ${isActive ? 'bg-green-600' : 'hover:bg-gray-700'}`}
                >
                    <FaParking className="mr-3" />
                    Parking Spots
                </NavLink>
            </nav>
            <div className="absolute bottom-0 w-full p-4">
                <button
                    onClick={logout}
                    className="flex items-center w-full p-3 text-left hover:bg-gray-700 rounded"
                >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;