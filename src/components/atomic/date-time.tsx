"use client";
 
import * as React from "react";
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/atomic/button";
import { Calendar } from "@/components/atomic/calendar";
import { Label } from "@/components/atomic/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atomic/popover";
import { ScrollArea, ScrollBar } from "@/components/atomic/scroll-area";

interface DateTimePicker24hProps {
  dateTime?: Date;
  setDateTime?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker24h({ 
  dateTime, 
  setDateTime, 
  label,
  placeholder = "MM/DD/YYYY hh:mm",
}: DateTimePicker24hProps) {
  const [date, setDate] = React.useState<Date | undefined>(dateTime);
  const [isOpen, setIsOpen] = React.useState(false);
  const isInternalUpdate = React.useRef(false);
 
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  React.useEffect(() => {
    if (!isInternalUpdate.current) {
      setDate(dateTime);
    }
    isInternalUpdate.current = false;
  }, [dateTime]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Preserve time if date already exists
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      isInternalUpdate.current = true;
      setDate(newDate);
      if (setDateTime) {
        setDateTime(newDate);
      }
    }
  };
 
  const handleTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      isInternalUpdate.current = true;
      setDate(newDate);
      if (setDateTime) {
        setDateTime(newDate);
      }
    } else {
      // If no date is selected, create a new date with today's date and the selected time
      const newDate = new Date();
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      isInternalUpdate.current = true;
      setDate(newDate);
      if (setDateTime) {
        setDateTime(newDate);
      }
    }
  };
 
  return (
    <div>
      {label && (
        <Label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          {label}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "MM/dd/yyyy HH:mm")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x bg-indigo-50 dark:bg-indigo-950/20">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() === hour ? "default" : "ghost"}
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      date && date.getHours() === hour && "bg-indigo-500 text-white hover:bg-indigo-600"
                    )}
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      date && date.getMinutes() === minute && "bg-indigo-500 text-white hover:bg-indigo-600"
                    )}
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
}