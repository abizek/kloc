import { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '../../utils'
import { buttonVariants } from './button.variants'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, ...props }, ref) {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
