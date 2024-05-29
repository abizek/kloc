import { Github } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

export function GitHubLink() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          href="https://github.com/abizek/stopwatch"
          target="_blank"
          rel="noreferrer"
          className="h-fit"
          aria-label="View GitHub"
        >
          <Github className="size-7" />
        </a>
      </TooltipTrigger>
      <TooltipContent>View GitHub</TooltipContent>
    </Tooltip>
  )
}
