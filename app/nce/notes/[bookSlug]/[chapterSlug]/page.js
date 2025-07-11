// app/nce/notes/[bookSlug]/[chapterSlug]/page.js
'use client';

import { ChapterLoader } from '@/components/ChapterLoader';

export default function ChapterPage({ params }) {
  const { bookSlug, chapterSlug } = params;
  return <ChapterLoader bookSlug={bookSlug} chapterSlug={chapterSlug} />;
}
