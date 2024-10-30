// app/nce/layout.js
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'NCE',
  description: 'National Counselor Examination preparation materials',
}

export default function NCELayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {children}
    </div>
  );
}
