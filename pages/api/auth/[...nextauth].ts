// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace this with real lookup (DB, API)
        if (
          credentials?.email === 'admin@example.com' &&
          credentials.password === '1234'
        ) {
          return { id: '1', name: 'Admin User', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login', // our custom login page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'CHANGE_THIS_SECRET',
});
