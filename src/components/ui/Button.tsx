// src/components/ui/Button.tsx
import * as React from "react";

// --- Type Definitions ---
type ButtonSize = "sm" | "default" | "lg" | "xl";
type ButtonVariant = "default" | "secondary" | "outline" | "primary";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: ButtonSize; 
  variant?: ButtonVariant; 
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    
    // --- Styles Mapping (No change) ---
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50";

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base",
      xl: "h-12 px-10 text-lg rounded-lg", 
    };

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-blue-600 text-white shadow-md hover:bg-blue-700", 
        default: "bg-gray-500 text-white hover:bg-gray-600",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    };

    // FIX: Simple logic to fix 'children.props is of type unknown'
    if (asChild) {
        return <>{children}</>;
    }
    
    const allClasses = classNames(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      className 
    );

    return (
      <button
        className={allClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };