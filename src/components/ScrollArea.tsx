import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '../utils'
import React from 'react'

const ScrollArea = ({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.ScrollAreaProps) => (
  <ScrollAreaPrimitive.Root className={className} type="scroll" {...props}>
    <ScrollAreaPrimitive.Viewport className="size-full">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = ({
  className,
  ...props
}: ScrollAreaPrimitive.ScrollAreaScrollbarProps) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    className={cn(
      'flex h-full w-2.5 touch-none select-none border-l border-l-transparent p-px',
      className,
    )}
    style={{ right: -20 }}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      style={
        { '--radix-scroll-area-thumb-width': '4px' } as React.CSSProperties
      }
      className="relative rounded-full bg-gray-300"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea }
