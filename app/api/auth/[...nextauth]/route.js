// app/api/auth/[...nextauth]/route.js - Fixed to properly expose Google ID
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === 'google') {
          // Check if user exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', account.providerAccountId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking existing user:', fetchError);
            return false;
          }

          if (existingUser) {
            // Update last login
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('google_id', account.providerAccountId);
          } else {
            // Create new user
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                google_id: account.providerAccountId,
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
              });

            if (insertError) {
              console.error('Error creating user:', insertError);
              return false;
            }

            // Create default preferences
            const { data: newUser } = await supabase
              .from('users')
              .select('id')
              .eq('google_id', account.providerAccountId)
              .single();

            if (newUser) {
              await supabase
                .from('user_preferences')
                .insert({
                  user_id: newUser.id,
                  preferred_papers: ['paper1'],
                  daily_goal: 10,
                  study_streak: 0,
                  longest_streak: 0,
                  notifications_enabled: true,
                  email_notifications: false,
                  weekly_summary: true,
                  theme_preference: 'system'
                });
            }
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Add Google ID to session
      if (token.sub) {
        session.user.googleId = token.sub;
        session.user.id = token.sub; // Keep both for compatibility
        
        // Get internal user ID for other operations
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('google_id', token.sub)
            .single();
          
          if (userData) {
            session.user.internalId = userData.id;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
