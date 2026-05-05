import { useNavigate, Link } from "react-router-dom";
import { LogOut, Wallet, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authService } from "../../services";

type AppHeaderProps = {
  activePage: "dashboard" | "transactions" | "categories" | "account";
  userName?: string;
};

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard" },
  { key: "transactions", label: "Transações", to: "/transactions" },
  { key: "categories", label: "Categorias", to: "/categories" },
] as const;

function getInitials(name?: string) {
  if (!name) {
    return "CT";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppHeader({ activePage, userName }: AppHeaderProps) {
  const navigate = useNavigate();
  const userInitials = getInitials(userName);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  function handleLogout() {
    authService.logout();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (open && menuRef.current && buttonRef.current && !menuRef.current.contains(target) && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-700">
              Financy
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          {NAV_ITEMS.map((item) =>
            item.key === activePage ? (
              <span key={item.key} className="flex items-center gap-2 text-emerald-700">
                {item.label}
              </span>
            ) : (
              <Link key={item.key} className="transition-colors hover:text-slate-800" to={item.to}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="relative">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-700"
              onClick={() => setOpen((s) => !s)}
              ref={buttonRef}
            >
              {userInitials}
            </button>
          </div>

          {open ? (
            <div ref={menuRef} className="absolute right-0 mt-2 w-40 rounded-lg border bg-white py-1 shadow-lg">
              <Link to="/account" onClick={() => setOpen(false)} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <User size={16} />
                Editar usuário
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}