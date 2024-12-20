import React, { useState } from 'react';
import NavBar from './Components/NavBar/NavBar';
import Users from './Components/Users/Users';

function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = (state) => {
    setIsNavbarOpen(state); // Update navbar state
  };

  return (
    <>
      <div className="relative">
        <NavBar toggleNavbar={toggleNavbar} />
      </div>

      {/* Pass isNavbarOpen to Users component */}
      <div
        className={`transition-all duration-300 p-4 w-full ${
          isNavbarOpen ? 'ml-64' : '' // Add margin-left when navbar is open on large screens
        }`}
      >
        <Users isNavbarOpen={isNavbarOpen} />
      </div>
    </>
  );
}

export default App;
