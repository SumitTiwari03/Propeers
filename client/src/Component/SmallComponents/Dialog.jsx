// components/ui/dialog.jsx
import * as React from "react"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  )
}

const DialogContent = ({ className, children, ...props }) => (
  <div
    className={`relative grid w-full max-w-lg gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 dark:border-gray-800 dark:bg-gray-950 sm:rounded-lg md:w-full ${className}`}
    {...props}
  >
    {children}
  </div>
)

const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
)

const DialogTitle = ({ className, ...props }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50 ${className}`}
    {...props}
  />
)

export { Dialog, DialogContent, DialogHeader, DialogTitle }