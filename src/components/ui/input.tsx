import * as React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  maxWidthClass?: string
}

const Input = ({ className, type, value: propValue, maxWidthClass, ...props }: InputProps) => {
  const [value, setValue] = useState(propValue ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(propValue ?? "")
  }, [propValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div 
      className={cn(
        "w-full flex justify-start lg:justify-end",
        maxWidthClass ?? "lg:max-w-[300px] relative"
      )}
    >
      <input
        ref={inputRef}
        type={type}
        data-slot="input"
        value={value}
        onChange={handleChange}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus:border-redberry focus:border-[2px]",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
