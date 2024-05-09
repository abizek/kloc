export function HeaderSkeleton() {
  return (
    <header className="z-10 flex w-full items-center justify-end gap-4 p-6 [&_div]:animate-pulse [&_div]:bg-black/10 [&_div]:dark:bg-white/10">
      <div className="size-7 rounded-full" />
      <div className="h-4 w-0.5 shrink-0 rounded" />
      <div className="size-7 rounded-full" />
    </header>
  )
}
