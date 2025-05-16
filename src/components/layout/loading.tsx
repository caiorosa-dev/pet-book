import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="flex justify-center items-center h-full w-full animate-fade-up">
      <Loader2 className="text-primary animate-spin size-6" />
    </div>
  )
}
