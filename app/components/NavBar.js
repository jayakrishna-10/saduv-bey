export default function NavBar() {
  return (
    <nav className="border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-gray-900">Saduv Bey</span>
            <div className="h-6 w-px bg-gray-200"></div>
            <span className="text-sm font-medium text-gray-600">NCE</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Home
          </button>
        </div>
      </div>
    </nav>
  );
}
