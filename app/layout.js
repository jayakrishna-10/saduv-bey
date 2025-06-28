// app/layout.js
import './globals.css'
import 'katex/dist/katex.min.css'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import AskAI from './components/AskAI'

export const metadata = {
  title: {
    template: '%s | Saduv Bey',
    default: 'Saduv Bey',
  },
  description: 'Comprehensive exam preparation platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <NavBar />
          {children}
          <AskAI />
        </ErrorBoundary>
      </body>
    </html>
  );
}
