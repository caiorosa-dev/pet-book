import { FullScreenPage } from '@/components/layout/full-screen-page';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullScreenPage className='flex justify-center items-center'>
      {children}
    </FullScreenPage>
  );
}
