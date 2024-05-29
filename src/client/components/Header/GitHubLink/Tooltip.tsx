import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = ({ ...props }: TooltipPrimitive.TooltipContentProps) => (
  <TooltipPrimitive.Content
    sideOffset={12}
    className="z-40 overflow-hidden rounded-full border border-black/10 bg-gray-50/20 px-3 py-1.5 text-sm text-gray-800 shadow-md backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-white/10 dark:bg-black/20 dark:text-gray-200"
    {...props}
  />
)

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
