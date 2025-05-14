import { FullScreenPage } from "@/components/layout/full-screen-page";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FullScreenPage
        inApp
        className="flex flex-col items-center justify-between"
      >
        <Header className="flex  items-center justify-between p-4 self-start w-full" />
        {children}
      </FullScreenPage>
    </>
  );
}
