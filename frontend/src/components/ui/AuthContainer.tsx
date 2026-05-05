import { Coins } from "lucide-react";
import React from "react";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
          <Coins size={20} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Financy
        </h1>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {children}
      </div>
    </div>
  );
}