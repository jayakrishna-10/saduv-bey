// app/nce/revision/[paper]/[chapter]/layout.js
export async function generateMetadata({ params }) {
  const { paper, chapter } = params;
  
  return {
    title: `Chapter ${chapter} Revision - Paper ${paper} | NCE`,
    description: `Comprehensive revision notes for NCE Paper ${paper}, Chapter ${chapter} with formulas, mindmaps, and exam strategies`,
    keywords: [
      'NCE revision',
      'energy management',
      'energy audit',
      `paper ${paper}`,
      `chapter ${chapter}`,
      'exam preparation',
      'formulas',
      'study notes'
    ]
  };
}

export default function ChapterRevisionLayout({ children, params }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {children}
    </div>
  );
}
