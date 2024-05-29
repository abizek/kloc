import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'min-h-11 min-w-28 scale-[1.15] rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/70 focus-visible:ring-offset-gray-200 dark:focus-visible:ring-gray-200',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-500 text-white hover:bg-indigo-500/90 disabled:bg-indigo-200 dark:bg-indigo-950 dark:text-gray-200 dark:hover:bg-indigo-950/80 dark:hover:text-gray-200/80 dark:disabled:bg-indigo-950/40 dark:disabled:text-gray-800',
        secondary:
          'bg-gray-300/60 text-gray-700 hover:bg-gray-200 active:bg-gray-300/60 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-900/80 dark:hover:text-gray-200/80 dark:active:bg-gray-900/70 dark:disabled:bg-gray-900 dark:disabled:text-gray-700',
        destructive:
          'bg-red-700/90 text-white hover:bg-red-700/80 dark:bg-red-950 dark:text-gray-200 dark:hover:bg-red-950/80 dark:hover:dark:text-gray-200/90',
        icon: 'min-h-fit min-w-fit scale-100 rounded-sm font-normal transition-transform duration-300 hover:scale-125 hover:duration-150 active:scale-90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
