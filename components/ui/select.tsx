"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "./utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-select-container]')) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative" data-select-container>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  
  const { value, isOpen, setIsOpen } = context;

  return (
    <button
      type="button"
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className={cn(!value && "text-gray-400")}>
        {children || "Select..."}
      </span>
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  
  const { value } = context;
  return <span>{value || placeholder}</span>;
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  
  const { isOpen } = context;
  
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    children: React.ReactNode;
  }
>(({ className, value: itemValue, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  
  const { value, onValueChange, setIsOpen } = context;
  const isSelected = value === itemValue;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100",
        isSelected && "bg-[#1A2BC2]/10 text-[#1A2BC2]",
        className
      )}
      onClick={() => {
        onValueChange?.(itemValue);
        setIsOpen(false);
      }}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
