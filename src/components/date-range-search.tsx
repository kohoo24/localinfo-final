"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "@/lib/types";

interface DateRangeSearchProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeSearch({
  dateRange,
  onDateRangeChange,
}: DateRangeSearchProps) {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from
                ? format(dateRange.from, "PPP", { locale: ko })
                : "시작일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) =>
                onDateRangeChange({ ...dateRange, from: date })
              }
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to
                ? format(dateRange.to, "PPP", { locale: ko })
                : "종료일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
              locale={ko}
              disabled={(date) =>
                dateRange.from ? date < dateRange.from : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {(dateRange.from || dateRange.to) && (
        <Button
          variant="ghost"
          onClick={() => onDateRangeChange({})}
          className="text-sm"
        >
          초기화
        </Button>
      )}
    </div>
  );
}
