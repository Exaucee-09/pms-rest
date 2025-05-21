// src/components/Sidebar.jsx
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaParking, FaTachometerAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
            >
                <FaBars size={20} />
            </button>

            {/* Sidebar */}
            <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                     md:translate-x-0 transform transition-transform duration-200 ease-in-out
                     fixed md:static w-64 bg-gray-800 text-white h-screen z-40`}>
                <div className="p-4 text-xl font-bold">Parking System</div>
                <div className="p-4 text-sm">Welcome, {user.name}</div>
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
        </>
    );
};

export default Sidebar;