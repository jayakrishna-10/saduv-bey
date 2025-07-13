// app/nce/revision/layout.js
export const metadata = {
  title: 'NCE Revision Notes',
  description: 'Comprehensive revision notes with formulas, mindmaps, and exam strategies for NCE preparation',
};

export default function RevisionLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] dark:from-gray-900 dark:to-gray-800">
      {children}
    </div>
  );
}
