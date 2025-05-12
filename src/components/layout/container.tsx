export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl w-full mx-auto h-full grid grid-rows-[auto_1fr] p-4 animate-fade-up">{children}</div>
  );
}