import { FullScreenPage } from '@/components/layout/full-screen-page';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullScreenPage inApp className='flex justify-center items-center'>
      {children}
    </FullScreenPage>
  );
}
