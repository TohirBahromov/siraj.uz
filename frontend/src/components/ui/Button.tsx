import { cn } from "@/lib/utils";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "dark-ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
  secondary:
    "bg-transparent text-white border border-white/40 hover:border-white/70 hover:bg-white/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline active:scale-[0.98]",
  "dark-ghost":
    "bg-transparent text-indigo-600 hover:text-indigo-500 underline-offset-2 hover:underline active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
