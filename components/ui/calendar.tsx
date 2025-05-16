import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        month: 'space-y-4',
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative gap-2 capitalize',
        month_caption: 'flex justify-center pt-1 relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center justify-between absolute inset-x-0',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10',
        ),
        weeks: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-none first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        ),
        range_start:
          'day-range-start !bg-accent rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_end:
          'day-range-end !bg-accent rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_hidden: 'invisible',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 !aria-selected:bg-accent/50 !aria-selected:text-muted-foreground !aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeftIcon {...props} className="h-4 w-4" />
          ) : (
            <ChevronRightIcon {...props} className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
