import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="z-10 flex w-full justify-end p-6">
        <a
          href="https://github.com/abizek/stopwatch"
          target="_blank"
          rel="noreferrer"
          className='h-fit'
        >
          <Github className="size-7 dark:stroke-gray-50" />
        </a>
      </header>
  )
}