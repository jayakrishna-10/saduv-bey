// FILE: app/lib/auth.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Enhanced logging function
function logAuth(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[AUTH] [${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

// Initialize Supabase client with service role key for admin-level access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

logAuth('info', 'Auth module initialized', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      logAuth('info', '=== SIGN IN CALLBACK STARTED ===', {
        provider: account?.provider,
        userEmail: user?.email,
        userName: user?.name,
        accountId: account?.providerAccountId
      });

      if (account.provider === "google") {
        try {
          logAuth('info', 'Processing Google sign-in', {
            userEmail: user.email,
            userName: user.name,
            userImage: user.image,
            googleId: account.providerAccountId
          });

          // Check if user already exists
          logAuth('info', 'Checking for existing user...');
          let { data: existingUser, error: queryError } = await supabase
            .from("users")
            .select("id, google_id")
            .eq("email", user.email)
            .single();

          logAuth('info', 'User query result', {
            existingUserFound: !!existingUser,
            existingUserId: existingUser?.id,
            existingGoogleId: existingUser?.google_id,
            queryError: queryError?.message,
            queryErrorCode: queryError?.code
          });

          if (queryError && queryError.code !== "PGRST116") {
            // PGRST116 means no rows found, which is not an error here
            logAuth('error', 'Supabase query error:', queryError);
            return false; // Prevent sign-in on database error
          }

          if (existingUser) {
            // User exists, update their last login and avatar if needed
            logAuth('info', 'Updating existing user...');
            
            const updateData = {
              last_login: new Date().toISOString(),
              avatar_url: user.image,
              name: user.name, // Also update name in case it changed
              google_id: account.providerAccountId, // Ensure google_id is set
            };

            logAuth('info', 'Update data prepared:', updateData);

            const { error: updateError } = await supabase
              .from("users")
              .update(updateData)
              .eq("id", existingUser.id);

            if (updateError) {
              logAuth('error', 'Error updating user:', updateError);
              return false; // Prevent sign-in on update error
            }

            logAuth('info', 'User updated successfully');
            user.id = existingUser.id; // Attach db id to the user object
            
            logAuth('info', 'Sign-in successful for existing user', {
              dbUserId: existingUser.id,
              userEmail: user.email
            });

          } else {
            // User does not exist, create a new user record
            logAuth('info', 'Creating new user...');
            
            const insertData = {
              google_id: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
            };

            logAuth('info', 'Insert data prepared:', insertData);

            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert(insertData)
              .select("id")
              .single();

            logAuth('info', 'User creation result:', {
              success: !!newUser,
              newUserId: newUser?.id,
              insertError: insertError?.message
            });

            if (insertError) {
              logAuth('error', 'Error creating user:', insertError);
              return false; // Prevent sign-in on insert error
            }

            user.id = newUser.id; // Attach new db id
            
            logAuth('info', 'Sign-in successful for new user', {
              dbUserId: newUser.id,
              userEmail: user.email
            });
          }
          
          logAuth('info', '=== SIGN IN CALLBACK COMPLETED SUCCESSFULLY ===');
          return true; // Sign-in successful
        } catch (e) {
          logAuth('error', 'Sign-in callback error:', {
            message: e.message,
            stack: e.stack,
            name: e.name
          });
          return false;
        }
      }
      
      logAuth('error', 'Non-Google provider attempted:', account?.provider);
      return false; // Only allow Google provider
    },
    
    async jwt({ token, user, account }) {
      logAuth('info', 'JWT callback triggered', {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account,
        userId: user?.id,
        tokenDbId: token?.db_id
      });

      // Persist the user's database ID to the token
      if (user) {
        logAuth('info', 'Adding database ID to token', {
          userId: user.id,
          userEmail: user.email
        });
        token.db_id = user.id;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      logAuth('info', 'Session callback triggered', {
        hasSession: !!session,
        hasSessionUser: !!session?.user,
        hasToken: !!token,
        tokenDbId: token?.db_id,
        sessionUserEmail: session?.user?.email
      });

      // Add the database ID to the session object
      if (token && session.user) {
        session.user.id = token.db_id;
        
        logAuth('info', 'Database ID added to session', {
          sessionUserId: session.user.id,
          sessionUserEmail: session.user.email
        });
      } else {
        logAuth('error', 'Failed to add database ID to session', {
          hasToken: !!token,
          hasSessionUser: !!session?.user,
          tokenDbId: token?.db_id
        });
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign-in
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
};
