// FILE: app/layout.js
import './globals.css'
import 'katex/dist/katex.min.css'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import { ThemeProvider } from './context/ThemeContext'
import AuthSessionProvider from './components/AuthSessionProvider'

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
        <AuthSessionProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavBar />
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
