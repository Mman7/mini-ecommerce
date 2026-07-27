import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type AnchorButtonProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = AnchorButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-[color:var(--primary-ink)] hover:bg-primary-soft shadow-[var(--glow)]",
  secondary:
    "glass-panel border border-[color:var(--glass-border)] text-foreground hover:border-[color:var(--primary-soft)]",
  ghost: "bg-transparent text-foreground hover:bg-[rgba(233,139,44,0.1)]",
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  if (typeof props.href === "string") {
    const {
      variant = "primary",
      className,
      children,
      ...anchorProps
    } = props as AnchorButtonProps;
    const classes = joinClasses(
      "meta-font inline-flex items-center justify-center rounded-sm px-6 py-3 text-sm font-semibold transition-all duration-300 focus-amber",
      variantClasses[variant],
      className,
    );
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    variant = "primary",
    className,
    children,
    ...buttonProps
  } = props as NativeButtonProps;
  const classes = joinClasses(
    "meta-font inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-amber",
    variantClasses[variant],
    className,
  );

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
