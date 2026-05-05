import type { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  rightIcon?: ReactNode;
  rightIconAriaLabel?: string;
  onRightIconClick?: () => void;
  error?: boolean;
}

export function Input({
  icon,
  rightIcon,
  rightIconAriaLabel,
  onRightIconClick,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <div
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            error ? "text-red-500" : "text-gray-400"
          }`}
        >
          {icon}
        </div>
      )}

      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          aria-label={rightIconAriaLabel ?? "Ação do campo"}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            error ? "text-red-500" : "text-gray-400"
          } cursor-pointer`}
        >
          {rightIcon}
        </button>
      )}

      <input
        className={`
          w-full py-3 border rounded-lg text-base outline-none transition
          ${icon ? "pl-10" : "px-4"}
          ${rightIcon ? "pr-10" : ""}
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"}
          focus:ring-2
          ${error ? "focus:border-red-500" : "focus:border-green-500"}
          ${className ?? ""}
        `}
        {...props}
      />
    </div>
  );
}