// pages/index.tsx
import { GetServerSideProps } from 'next';

export default function Home() {
  // This component will never actually render client-side
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
