import type { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
}

export function Input({ icon, error, className, ...props }: InputProps) {
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

      <input
        className={`
          w-full py-3 border rounded-lg text-base outline-none transition
          ${icon ? "pl-10" : "px-4"}
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
