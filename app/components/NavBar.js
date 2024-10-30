const NavBar = () => {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Site Context */}
          <div className="flex items-center gap-6">
            {/* Main Site Logo/Name */}
            <a href="/" className="flex items-center">
              <span className="text-lg font-bold text-gray-900">Saduv Bey</span>
            </a>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* Current Section */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">NCE Examination</span>
            </div>
          </div>

          {/* Right side - Navigation */}
          <div
              href="/"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
