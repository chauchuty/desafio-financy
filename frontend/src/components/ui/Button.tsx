import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  className,
  icon,
  iconPosition = "left",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "w-full p-2 rounded-lg transition font-bold text-base flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-700",
    outline:
      "bg-white border-2 border-green-700 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className ?? ""}`}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}