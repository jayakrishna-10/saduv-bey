// app/nce/flashcards/layout.js
import NavBar from '@/components/NavBar'

export const metadata = {
  title: 'Flashcards - NCE',
  description: 'Review key concepts with interactive flashcards',
}

export default function FlashcardsLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
