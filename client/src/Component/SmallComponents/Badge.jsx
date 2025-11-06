// components/ui/badge.jsx
import * as React from "react"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900",
    secondary: "border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:focus:ring-gray-300 ${variants[variant]} ${className}`}
      {...props}
    />
  ) 
})
Badge.displayName = "Badge"

export { Badge }