import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-cta-primary)] text-[var(--color-text-primary)] hover:opacity-90",
        destructive: "bg-[var(--color-accent-error)] text-[var(--color-text-primary)] hover:opacity-90",
        outline:
          "border border-slate-400/30 bg-slate-900/70 text-[var(--color-text-primary)] hover:bg-slate-800/70",
        secondary:
          "bg-slate-800/70 text-[var(--color-text-primary)] hover:bg-slate-700/70",
        ghost: "text-[var(--color-text-primary)] hover:bg-slate-800/60",
        link: "text-[var(--color-azul-electrico)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
