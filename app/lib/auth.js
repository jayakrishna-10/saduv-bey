// FILE: app/lib/auth.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

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

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Check if user already exists
          let { data: existingUser, error: queryError } = await supabase
            .from("users")
            .select("id, google_id")
            .eq("email", user.email)
            .single();

          if (queryError && queryError.code !== "PGRST116") {
            // PGRST116 means no rows found, which is not an error here
            console.error("Supabase query error:", queryError);
            return false; // Prevent sign-in on database error
          }

          if (existingUser) {
            // User exists, update their last login and avatar if needed
            const { error: updateError } = await supabase
              .from("users")
              .update({
                last_login: new Date().toISOString(),
                avatar_url: user.image,
                name: user.name, // Also update name in case it changed
                google_id: account.providerAccountId, // Ensure google_id is set
              })
              .eq("id", existingUser.id);

            if (updateError) {
              console.error("Error updating user:", updateError);
              return false; // Prevent sign-in on update error
            }
            user.id = existingUser.id; // Attach db id to the user object
          } else {
            // User does not exist, create a new user record
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert({
                google_id: account.providerAccountId,
                email: user.email,
                name: user.name,
                avatar_url: user.image,
              })
              .select("id")
              .single();

            if (insertError) {
              console.error("Error creating user:", insertError);
              return false; // Prevent sign-in on insert error
            }
            user.id = newUser.id; // Attach new db id
          }
          return true; // Sign-in successful
        } catch (e) {
          console.error("Sign-in callback error:", e);
          return false;
        }
      }
      return false; // Only allow Google provider
    },
    async jwt({ token, user, account }) {
      // Persist the user's database ID to the token
      if (user) {
        token.db_id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the database ID to the session object
      if (token && session.user) {
        session.user.id = token.db_id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign-in
  },
  secret: process.env.NEXTAUTH_SECRET,
};
