import { app } from "@/lib/firebase";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      uid?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    idToken?: string;
  }
  
  interface User extends DefaultUser {
    uid?: string;
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials in environment variables');
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: '/auth/error',
  },
  debug: true, // Enable debug logs
  callbacks: {
    async signIn({ account, user }) {
      console.log('NextAuth signIn callback started', { 
        user,
        accountTokens: {
          hasAccessToken: !!account?.access_token,
          hasIdToken: !!account?.id_token
        }
      });
      
      if (!account?.access_token || !account?.id_token) {
        console.error('Missing tokens:', { account });
        return false; // Don't allow sign in without tokens
      }

      try {
        console.log('Attempting Firebase authentication');
        const auth = getAuth(app);
        
        // Create a credential from the Google tokens
        const credential = GoogleAuthProvider.credential(
          account.id_token,
          account.access_token
        );
        
        // Sign in to Firebase with the credential
        const result = await signInWithCredential(auth, credential);
        console.log('Firebase auth successful:', { 
          uid: result.user.uid,
          email: result.user.email 
        });
        
        // Store the UID in the user object
        user.uid = result.user.uid;
        
        return true;
      } catch (error: any) {
        console.error('Firebase sign-in error:', error);
        // Log detailed error information
        if (error.code) console.error('Error code:', error.code);
        if (error.message) console.error('Error message:', error.message);
        if (error.stack) console.error('Stack trace:', error.stack);
        return false; // Don't allow sign in if Firebase auth fails
      }
    },
    async session({ session, token }) {
      console.log('Session callback', { 
        token: {
          hasAccessToken: !!token.accessToken,
          hasIdToken: !!token.idToken,
          hasUid: !!token.uid
        }
      });
      
      if (session?.user) {
        // Use the Firebase UID instead of token.sub
        session.user.uid = token.uid as string;
        // Store tokens in session if they exist
        if (token.accessToken) {
          session.accessToken = token.accessToken as string;
        }
        if (token.idToken) {
          session.idToken = token.idToken as string;
        }
      }
      return session;
    },
    async jwt({ token, account, trigger, user }) {
      console.log('JWT callback', { 
        trigger,
        hasAccount: !!account,
        hasAccessToken: !!token.accessToken,
        hasIdToken: !!token.idToken,
        account: {
          access_token: account?.access_token ? 'exists' : 'missing',
          id_token: account?.id_token ? 'exists' : 'missing'
        }
      });
      
      // Always store tokens when we get them
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      // Preserve the Firebase UID in the token
      if (user?.uid) {
        token.uid = user.uid;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
