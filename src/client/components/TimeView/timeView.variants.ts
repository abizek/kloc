import { cva } from 'class-variance-authority'

export const timeViewVariants = cva('tracking-tight', {
  variants: {
    variant: {
      default:
        'text-6xl leading-relaxed text-gray-800 md:text-7xl md:leading-relaxed dark:text-gray-50',
      secondary: 'text-3xl text-gray-600/90 md:text-[2rem] dark:text-gray-400',
      unstyled: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
