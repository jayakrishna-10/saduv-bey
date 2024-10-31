// app/layout.js
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata = {
  title: {
    template: '%s | Saduv Bey',
    default: 'Saduv Bey',
  },
  description: 'Comprehensive exam preparation platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
