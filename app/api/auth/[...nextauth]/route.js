// app/api/auth/[...nextauth]/route.js
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
      if (account.provider === 'google') {
        try {
          console.log('SignIn - Google ID:', user.id); // Debug log
          
          // Check if user exists in our database
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
            return false;
          }

          // If user doesn't exist, create new user
          if (!existingUser) {
            console.log('Creating new user with Google ID:', user.id);
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                google_id: user.id,
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
          } else {
            console.log('Updating existing user login time');
            // Update last login
            const { error: updateError } = await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('google_id', user.id);

            if (updateError) {
              console.error('Error updating last login:', updateError);
            }
          }

          return true;
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Store the Google ID in the token
      if (account && user) {
        console.log('JWT - Setting Google ID:', user.id); // Debug log
        token.googleId = user.id; // This is the actual Google ID from OAuth
      }
      return token;
    },
    async session({ session, token }) {
      if (token.googleId) {
        console.log('Session - Looking up user with Google ID:', token.googleId); // Debug log
        
        // Fetch user data from our database using the Google ID
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', token.googleId)
          .single();

        if (!error && userData) {
          console.log('Session - User found:', userData.id); // Debug log
          // Set both the internal database ID and the Google ID
          session.user.id = userData.id; // Internal database UUID
          session.user.googleId = userData.google_id; // Actual Google ID
          session.user.createdAt = userData.created_at;
        } else {
          console.error('Session - User lookup error:', error);
          // Even if lookup fails, ensure we have the Google ID
          session.user.googleId = token.googleId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
