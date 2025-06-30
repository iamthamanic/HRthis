import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full p-0", className)}
      classNames={{
        months: "w-full",
        month: "w-full",
        caption: "flex justify-center pt-1 relative items-center w-full hidden",
        caption_label: "text-sm font-medium",
        nav: "hidden",
        nav_button: "hidden",
        nav_button_previous: "hidden",
        nav_button_next: "hidden",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 w-full",
        head_cell: "text-gray-500 font-normal text-center py-2 text-sm border border-gray-100",
        row: "grid grid-cols-7 w-full",
        cell: cn(
          "relative p-0 text-center border border-gray-400/20 h-12 hover:bg-gray-50",
          props.mode === "range"
            ? "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : ""
        ),
        day: cn("h-full w-full flex items-center justify-center text-sm font-medium"),
        day_range_start: "day-range-start aria-selected:bg-orange-500 aria-selected:text-white",
        day_range_end: "day-range-end aria-selected:bg-orange-500 aria-selected:text-white",
        day_selected:
          "relative inline-flex items-center justify-center rounded-full !bg-transparent hover:bg-transparent hover:text-gray-800 focus:bg-transparent focus:text-gray-800 before:absolute before:size-8 before:rounded-full before:border-2 before:border-orange-500 before:content-[''] text-orange-500",
        day_today: "text-orange-500 font-bold",
        day_outside: "text-gray-400",
        day_disabled: "text-gray-300",
        day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-700",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
