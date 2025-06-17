import * as React from "react"
import { useRef, useState } from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input">

const Input = ({ className, type, ...props }: InputProps) => {
  const [value, setValue] = useState(props.value ?? "")
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.onChange?.(e)
  }

  const handleClear = () => {
    setValue("")
    inputRef.current?.focus()
    if (props.onChange) {
      const event = {
        ...new Event("input", { bubbles: true }),
        target: inputRef.current!,
      } as unknown as React.ChangeEvent<HTMLInputElement>
      inputRef.current!.value = ""
      props.onChange(event)
    }
  }

  const handleClearKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClear()
    }
  }

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        type={type}
        data-slot="input"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus:border-[#A2122B] focus:border-[2px]",
          className
        )}
        {...props}
      />
      {value && (isHovered || isFocused) && (
        <button
          type="button"
          tabIndex={0}
          aria-label="Clear input"
          onClick={handleClear}
          onKeyDown={handleClearKeyDown}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-[#A2122B] text-white hover:bg-[#757575] focus:outline-none"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export { Input }
