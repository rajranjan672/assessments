import React, { useState } from 'react';
import vector from "../../assets/Vector.png"
import { Cog6ToothIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';


const NavBar = ({ toggleNavbar }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    toggleNavbar(!isOpen); // Pass state up to parent component (App)
  };

  return (
    <div>
      {/* Hamburger Icon */}
      <button
        className="lg:hidden absolute top-4 left-4 text-black z-50"
        onClick={handleToggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar (Navbar) */}
      <div
        className={`fixed top-0 left-0 h-full bg-white text-black w-64 p-4 transition-all duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 z-40`}
      >
        <div className="flex flex-col items-start h-full">
          {/* Logo or App Name */}
          <div className="text-2xl font-semibold mt-8 ml-4">
            <img src={vector} />
          </div>

          {/* Navbar items */}
          <div className={`mt-8 space-y-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
            <a href="#" className="flex justify-center justify-space-between px-4 py-2 rounded-md hover:bg-gray-700">
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-700" />
              Dashboard
            </a>
            <a href="#" className="flex justify-center px-4 py-2 rounded-md hover:bg-gray-700">
            <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
              Students
            </a>
            <a href="#" className="flex justify-center px-4 py-2 rounded-md hover:bg-gray-700">
              Chapter
            </a>
            <a href="#" className="flex justify-center px-4 py-2 rounded-md hover:bg-gray-700">
            
              Help
            </a>
            <a href="#" className="flex justify-center px-4 py-2 rounded-md hover:bg-gray-700">
              Report
            </a>
            <a href="#" className="flex justify-center px-4 py-2 rounded-md hover:bg-gray-700">
              Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
