import React from 'react';
import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-900">Saduv Bey</span>
          </div>
          
          {/* Navigation Links - right side */}
          <div className="flex items-center">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
