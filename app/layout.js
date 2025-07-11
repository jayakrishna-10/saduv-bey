// app/layout.js - Updated with ThemeProvider and Auth
import './globals.css'
import 'katex/dist/katex.min.css'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import AskAI from './components/AskAI'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './components/auth/AuthProvider'

export const metadata = {
  title: {
    template: '%s | Saduv Bey',
    default: 'Saduv Bey',
  },
  description: 'Comprehensive exam preparation platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavBar />
              {children}
              <AskAI />
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
