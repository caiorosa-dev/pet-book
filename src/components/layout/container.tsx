export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl w-full mx-auto h-full p-4 animate-fade-up pb-16">
      {children}
    </div>
  )
}
