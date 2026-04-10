"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export type ComboboxOption = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** If true, show a "clear" option that sets value to "" */
  nullable?: boolean;
  nullLabel?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  nullable = false,
  nullLabel = "— None —",
  className,
  disabled = false,
  searchable = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 bg-white text-sm transition-colors text-left",
            open
              ? "border-black/30 ring-2 ring-black/8"
              : "border-black/15 hover:border-black/25",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          <span className={cn("truncate", !selected && "text-black/40")}>
            {selected ? selected.label : nullable && !value ? nullLabel : placeholder}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {nullable && value && (
              <span
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onChange("")}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setOpen(false);
                }}
                className="p-0.5 rounded text-black/30 hover:text-black/60 cursor-pointer"
              >
                <X size={13} />
              </span>
            )}
            <ChevronDown
              size={15}
              className={cn(
                "text-black/30 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          {searchable && <CommandInput placeholder="Search…" />}
          <CommandList className={searchable ? undefined : "max-h-64"}>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup>
              {nullable && (
                <CommandItem
                  value={nullLabel}
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className={cn(value === "" ? "font-medium text-black" : "text-black/50")}
                >
                  <span className="w-4 shrink-0" />
                  {nullLabel}
                </CommandItem>
              )}
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(opt.value === value ? "font-medium text-black" : "")}
                >
                  {opt.value === value ? (
                    <Check size={14} className="shrink-0 text-black" />
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
