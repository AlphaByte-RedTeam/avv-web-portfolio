import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-6 sm:px-12 space-y-24">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-20">
          <section className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </section>

          <section className="space-y-8">
            <Skeleton className="h-6 w-40" />
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-16">
          <section className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-8 pl-6 border-l border-border/40">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
