// app/layout.js
import './globals.css'
import 'katex/dist/katex.min.css'
import ErrorBoundary from './components/ErrorBoundary'

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
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
