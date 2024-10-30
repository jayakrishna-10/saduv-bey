// app/page.js
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Your homepage content from NCEHomepage component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Welcome to Saduv Bey</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* NCE Card */}
          <Link href="/nce">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">NCE</h2>
              <p className="text-gray-600">National Counselor Examination preparation materials</p>
            </div>
          </Link>
          {/* Add more exam cards here */}
        </div>
      </div>
    </main>
  );
}
