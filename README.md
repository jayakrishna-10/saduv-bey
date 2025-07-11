
# NCE Quiz Application

A comprehensive exam preparation platform for National Certification Examination (NCE) with user authentication and performance tracking.

## Features

### Core Features
- **Interactive Quizzes**: Practice questions with immediate feedback and explanations
- **Mock Tests**: Full-length practice exams with timer and comprehensive scoring
- **Study Notes**: Organized chapter-wise study materials
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Profile System
- **Google OAuth Authentication**: Secure login with Google accounts
- **Performance Tracking**: Detailed analytics of quiz and test performance
- **Progress Monitoring**: Track your improvement over time
- **Achievement System**: Unlock achievements as you study
- **Study Streaks**: Maintain consistent study habits
- **Personalized Recommendations**: Get suggestions based on your weak areas
- **Data Export**: Export your study data for external analysis

### Analytics Dashboard
- **Overview Statistics**: Total quizzes, tests, average scores, and study time
- **Recent Activity**: View your latest quiz and test attempts
- **Strong/Weak Areas**: Identify chapters where you excel or need improvement
- **Achievement Progress**: Track your progress toward various goals
- **Chapter-wise Performance**: Detailed breakdown by study topics

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components
- **Math Rendering**: KaTeX for mathematical expressions
- **Markdown**: React-markdown for rich text content

## Project Structure

```
app/
├── api/                 # API routes
│   ├── auth/           # NextAuth.js authentication
│   ├── quiz/           # Quiz data endpoints
│   └── ask-ai/         # AI assistance endpoints
├── auth/               # Authentication pages
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── quiz/          # Quiz-related components
│   ├── test/          # Test-related components
│   └── ui/            # UI components
├── config/            # Configuration files
├── context/           # React context providers
├── lib/               # Utility functions and services
├── nce/               # Main application pages
└── profile/           # User profile pages
```

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- A Supabase account and project
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saduv-bey
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini API (for explanations)
GEMINI_API_KEY=your_gemini_api_key
```

5. Set up the database:
```bash
# Run the database schema setup (found in database/schema.sql)
```

6. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication data
- **quiz_attempts**: Individual quiz attempt records
- **test_attempts**: Full test attempt records
- **user_progress**: Chapter-wise progress tracking
- **study_sessions**: Daily study session tracking
- **user_achievements**: Achievement progress
- **user_preferences**: User settings and preferences

## API Routes

- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/api/quiz` - Quiz questions and explanations
- `/api/ask-ai` - AI-powered question assistance

## Authentication Flow

1. Users click "Sign in with Google"
2. NextAuth.js handles OAuth flow with Google
3. User profile is created/updated in Supabase
4. JWT tokens manage session state
5. Middleware protects authenticated routes

## Performance Tracking

The application automatically tracks:
- Quiz completion times and scores
- Test performance across chapters
- Study session duration
- Daily study streaks
- Chapter-wise mastery levels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
