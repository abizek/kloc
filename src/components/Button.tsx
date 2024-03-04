import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../utils'

const buttonVariants = cva('font-semibold min-w-28 min-h-11 scale-95 rounded-full', {
  variants: {
    variant: {
      default: 'bg-indigo-500 text-white hover:bg-indigo-500/90',
      secondary:
        'bg-gray-300/60 active:bg-gray-300/60 hover:bg-gray-200 disabled:bg-gray-200 text-gray-700 disabled:text-gray-500',
      destructive: 'bg-red-700/90 hover:bg-red-700/80 text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  )
}
