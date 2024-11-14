// app/page.js
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {/* Navigation */}
      <header className="container fixed top-0 z-50 flex h-16 items-center justify-between bg-transparent px-4">
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
          <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white">
            Sign up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container relative flex min-h-screen items-center justify-between px-4 pt-16">
        <div className="relative z-10 w-full max-w-2xl space-y-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tighter text-gray-800 md:text-6xl lg:text-7xl">
            Prepare.{" "}
            <span className="text-red-500 underline decoration-red-500/30 decoration-4">
              Practice
            </span>
            . Succeed.
          </h1>
          <p className="text-xl text-gray-600">
            Your Professional Exam Companion
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button className="inline-flex h-12 items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white">
              <AppleIcon className="h-5 w-5" />
              <span>App Store</span>
            </Button>
            <Button className="inline-flex h-12 items-center space-x-2 bg-white text-gray-900 hover:bg-gray-100 border border-gray-200">
              <PlayStoreIcon className="h-5 w-5" />
              <span>Play Store</span>
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Different Platform?{" "}
            <Link className="font-medium text-gray-700 underline" href="#">
              Contact us
            </Link>
          </div>
        </div>

        {/* Floating Cards Layout (Simplified without images) */}
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-[600px] w-[400px]">
            {/* Card placeholders with gradient backgrounds instead of images */}
            <div className="absolute right-0 top-0 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 p-8 shadow-lg w-[400px] h-[300px]">
              <div className="text-lg font-semibold text-gray-800">Interactive Quizzes</div>
              <div className="mt-2 text-sm text-gray-600">Practice with our comprehensive question bank</div>
            </div>
            <div className="absolute bottom-0 left-0 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 p-8 shadow-lg w-[400px] h-[300px]">
              <div className="text-lg font-semibold text-gray-800">Track Progress</div>
              <div className="mt-2 text-sm text-gray-600">Visual insights into your performance</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
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
