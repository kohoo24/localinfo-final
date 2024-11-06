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

interface DateSearchProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function DateSearch({ onDateSelect, selectedDate }: DateSearchProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, "PPP", { locale: ko })
              : "갱신일자 선택"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            locale={ko}
          />
        </PopoverContent>
      </Popover>
      {selectedDate && (
        <Button
          variant="ghost"
          onClick={() => onDateSelect(undefined)}
          className="text-sm"
        >
          초기화
        </Button>
      )}
    </div>
  );
}
