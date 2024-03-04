import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils'

const buttonVariants = cva(
  'min-h-11 min-w-28 scale-95 rounded-full font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-indigo-500 text-white hover:bg-indigo-500/90',
        secondary:
          'bg-gray-300/60 text-gray-700 hover:bg-gray-200 active:bg-gray-300/60 disabled:bg-gray-200 disabled:text-gray-500',
        destructive: 'bg-red-700/90 text-white hover:bg-red-700/80',
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
