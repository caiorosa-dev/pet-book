export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl mx-auto h-full p-4 animate-fade-up">{children}</div>
  );
}