// app/api/auth/[...nextauth]/route.js - Fixed Google ID handling
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
          // CRITICAL: user.id from Google OAuth is the actual Google ID
          const googleId = user.id;
          console.log('SignIn - Processing Google ID:', googleId);
          
          // Validate that we have a proper Google ID (should be numeric string)
          if (!googleId || typeof googleId !== 'string') {
            console.error('Invalid Google ID received:', googleId);
            return false;
          }
          
          // Check if user exists in our database using Google ID
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', googleId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
            return false;
          }

          // If user doesn't exist, create new user
          if (!existingUser) {
            console.log('Creating new user with Google ID:', googleId);
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                google_id: googleId, // Store the actual Google ID
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error creating user:', insertError);
              return false;
            }
            
            console.log('User created successfully:', newUser.id);
          } else {
            console.log('Updating existing user login time for:', googleId);
            // Update last login
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                last_login: new Date().toISOString(),
                // Update profile info in case it changed
                name: user.name,
                avatar_url: user.image
              })
              .eq('google_id', googleId);

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
      // CRITICAL: Store the actual Google ID in the token
      if (account && user && account.provider === 'google') {
        console.log('JWT - Setting Google ID in token:', user.id);
        // user.id from Google OAuth IS the Google ID
        token.googleId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      
      // Always ensure we have the Google ID in subsequent calls
      if (!token.googleId && token.sub) {
        console.warn('JWT - Missing Google ID, using sub as fallback:', token.sub);
        token.googleId = token.sub;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      try {
        // CRITICAL: Ensure we always use the Google ID from the token
        const googleId = token.googleId;
        
        if (!googleId) {
          console.error('Session - No Google ID in token:', token);
          return session;
        }

        console.log('Session - Using Google ID:', googleId);
        
        // Fetch user data from our database using the Google ID
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', googleId)
          .single();

        if (!error && userData) {
          console.log('Session - User found in database:', userData.id);
          // CRITICAL: Set both IDs correctly
          session.user.id = userData.id; // Internal database UUID
          session.user.googleId = userData.google_id; // MUST be the actual Google ID
          session.user.email = userData.email;
          session.user.name = userData.name;
          session.user.image = userData.avatar_url;
          session.user.createdAt = userData.created_at;
        } else {
          console.error('Session - User lookup failed:', error);
          // CRITICAL: Even if lookup fails, preserve the Google ID
          session.user.googleId = googleId;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.image = token.picture;
          
          // Log this as it might indicate a data consistency issue
          console.warn('Session - User not found in database but token exists. Google ID:', googleId);
        }
        
        // Validate that we have the Google ID set correctly
        if (!session.user.googleId) {
          console.error('Session - Failed to set Google ID. Token Google ID:', googleId);
          session.user.googleId = googleId; // Force set as fallback
        }
        
        console.log('Session - Final session user:', {
          id: session.user.id,
          googleId: session.user.googleId,
          email: session.user.email
        });
        
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        // Ensure we at least have the Google ID even if there's an error
        session.user.googleId = token.googleId;
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
