import * as React from "react";

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
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50";

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base",
      xl: "h-12 px-10 text-lg rounded-lg", 
    };

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-black text-white shadow-md hover:bg-zinc-800", 
        default: "bg-zinc-700 text-white hover:bg-zinc-800",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        outline: "border border-amber-600 text-amber-700 hover:bg-amber-50",
    };

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
