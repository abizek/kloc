import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils'

const buttonVariants = cva(
  'min-h-11 min-w-28 scale-[1.15] rounded-full font-semibold',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-500 text-white hover:bg-indigo-500/90 dark:bg-indigo-950 dark:text-gray-200 dark:hover:bg-indigo-950/80 dark:hover:dark:text-gray-200/80',
        secondary:
          'bg-gray-300/60 text-gray-700 hover:bg-gray-200 active:bg-gray-300/60 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-900/80 dark:hover:text-gray-200/80 dark:active:bg-gray-900/70 dark:disabled:bg-gray-900 dark:disabled:text-gray-700',
        destructive:
          'bg-red-700/90 text-white hover:bg-red-700/80 dark:bg-red-950 dark:text-gray-200 dark:hover:bg-red-950/80 dark:hover:dark:text-gray-200/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  )
}
