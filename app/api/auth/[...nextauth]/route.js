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
      if (account && user) {
        token.googleId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.googleId) {
        // Fetch user data from our database
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', token.googleId)
          .single();

        if (!error && userData) {
          session.user.id = userData.id;
          session.user.googleId = userData.google_id;
          session.user.createdAt = userData.created_at;
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