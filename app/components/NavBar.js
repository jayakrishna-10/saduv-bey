const NavBar = () => {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Breadcrumb */}
          <div className="flex items-center gap-2">
            {/* Main Site Logo/Name */}
            <a href="/" className="text-lg font-bold text-gray-900">
              Saduv Bey
            </a>
            
            {/* Breadcrumb Separator */}
            <span className="text-gray-400 px-2">/</span>
            
            {/* Exam Type */}
            <span className="text-sm font-medium text-gray-600">
              NCE Examination
            </span>
            
            {/* Optional: Add Quiz Type */}
            <span className="text-gray-400 px-2">/</span>
            <span className="text-sm font-medium text-blue-600">
              Practice Quiz
            </span>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-4">
              href="/nce"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              All Tests
            </a>
            
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
