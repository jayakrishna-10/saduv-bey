// app/nce/layout.js - Simplified without redundant header
export const metadata = {
  title: 'NCE',
  description: 'National Certification Examination preparation materials',
}

export default function NCELayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#ffffff]">
      {children}
    </div>
  );
}
