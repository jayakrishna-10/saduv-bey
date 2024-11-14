// app/page.js
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-transparent px-4">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link className="flex items-center space-x-2" href="/">
            <span className="text-xl font-bold text-gray-800">saduvbey</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-800" href="#">
              Feature
            </Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-800" href="#">
              About us
            </Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-800" href="#">
              Products
            </Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-800" href="#">
              Pricing
            </Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-800" href="#">
              Feedback
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
              href="#"
            >
              Log in
            </Link>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="flex min-h-screen flex-col lg:flex-row items-center justify-between gap-12 py-16">
          {/* Left Column: Prepare, Practice, Succeed */}
          <div className="lg:w-1/2 space-y-8 pt-16">
            <h1 className="text-5xl font-bold leading-tight tracking-tighter text-gray-800 md:text-6xl lg:text-7xl">
              Prepare.{" "}
              <span className="text-red-500 underline decoration-red-500/30 decoration-4">
                Practice
              </span>
              . Succeed.
            </h1>
            <p className="text-xl text-gray-600">
              Your Competitive Exam Companion
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="inline-flex h-12 items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6">
                <AppleIcon className="h-5 w-5" />
                <span className="font-medium">App Store</span>
              </Button>
              <Button className="inline-flex h-12 items-center justify-center space-x-2 bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg px-6">
                <PlayStoreIcon className="h-5 w-5" />
                <span className="font-medium">Play Store</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Different Platform?{" "}
              <Link className="font-medium text-gray-700 underline" href="#">
                Contact us
              </Link>
            </div>
          </div>

          {/* Right Column: Two Blocks */}
          <div className="lg:w-1/2 space-y-8 w-full">
            <Link href="/nce" className="block transition-transform hover:scale-105">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-lg p-8 transition-shadow hover:shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">NCE for Energy Managers and Energy Auditors</h2>
                <p className="text-gray-600">Prepare for your National Certification Examination with our comprehensive study materials and practice tests.</p>
              </div>
            </Link>
            <div className="bg-gradient-to-br from-gray-100 to-pink-50 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
              <p className="text-gray-600">Stay tuned for more exciting features and exam preparations. We're constantly working to bring you the best learning experience.</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed left-0 top-0 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="fixed bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
      </main>
    </div>
  )
}

function AppleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  )
}

function PlayStoreIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 3 21 12 3 21" />
    </svg>
  )
}
