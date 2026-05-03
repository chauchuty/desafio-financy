import { useEffect, useState, type ReactNode } from "react";
import {
  BriefcaseBusiness,
  CarFront,
  CircleDollarSign,
  CreditCard,
  Home,
  HeartPulse,
  Landmark,
  type LucideIcon,
  Package,
  PawPrint,
  PiggyBank,
  ShoppingCart,
  ShoppingBasket,
  Sparkles,
  Tag,
  Truck,
  Apple,
  UtensilsCrossed,
  X,
} from "lucide-react";

export type CategoryModalValues = {
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type CategoryModalInitialValues = CategoryModalValues;

type CategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryModalValues) => Promise<void> | void;
  initialValues?: CategoryModalInitialValues;
  title?: string;
  submitLabel?: string;
};

type IconOption = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const ICON_OPTIONS: IconOption[] = [
  { id: "tag", label: "Categoria", icon: Tag },
  { id: "utensils", label: "Alimentação", icon: UtensilsCrossed },
  { id: "car", label: "Transporte", icon: CarFront },
  { id: "shopping", label: "Compras", icon: ShoppingCart },
  { id: "basket", label: "Mercado", icon: ShoppingBasket },
  { id: "home", label: "Casa", icon: Home },
  { id: "briefcase", label: "Trabalho", icon: BriefcaseBusiness },
  { id: "bank", label: "Investimento", icon: Landmark },
  { id: "heart", label: "Saúde", icon: HeartPulse },
  { id: "piggy", label: "Poupança", icon: PiggyBank },
  { id: "package", label: "Serviço", icon: Package },
  { id: "sparkles", label: "Extras", icon: Sparkles },
  { id: "paw", label: "Pets", icon: PawPrint },
  { id: "truck", label: "Entrega", icon: Truck },
  { id: "dollar", label: "Receita", icon: CircleDollarSign },
  { id: "card", label: "Pagamentos", icon: CreditCard },
  { id: "apples", label: "Alimentação", icon: Apple },
];

const COLOR_OPTIONS = [
  { value: "emerald", className: "border-emerald-600 bg-emerald-500" },
  { value: "blue", className: "border-blue-600 bg-blue-500" },
  { value: "violet", className: "border-violet-600 bg-violet-500" },
  { value: "pink", className: "border-pink-600 bg-pink-500" },
  { value: "red", className: "border-red-600 bg-red-500" },
  { value: "orange", className: "border-orange-600 bg-orange-500" },
  { value: "amber", className: "border-amber-600 bg-amber-500" },
];

export function CategoryModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  title = "Nova categoria",
  submitLabel = "Salvar",
}: CategoryModalProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [icon, setIcon] = useState(ICON_OPTIONS[0].id);
  const [color, setColor] = useState(initialValues?.color ?? COLOR_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? "");
      setDescription(initialValues?.description ?? "");
      setIcon(initialValues?.icon ?? ICON_OPTIONS[0].id);
      setColor(initialValues?.color ?? COLOR_OPTIONS[0].value);
      setSubmitted(false);
      setLoading(false);
      return;
    }

    setName("");
    setDescription("");
    setIcon(ICON_OPTIONS[0].id);
    setColor(COLOR_OPTIONS[0].value);
    setSubmitted(false);
    setLoading(false);
  }, [initialValues, open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const titleError = submitted && !name.trim();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!name.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 py-8 backdrop-blur-sm">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">Organize suas transações com categorias</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Field label="Título">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex. Alimentação"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                titleError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
              }`}
            />
            {titleError ? <ErrorText>Informe o título da categoria.</ErrorText> : null}
          </Field>

          <Field label="Descrição">
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descrição da categoria"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </Field>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 mb-4">Opcional</p>
            <p className="text-sm font-medium text-slate-600">Ícone</p>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = icon === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setIcon(option.id)}
                    title={option.label}
                    className={`grid h-10 place-items-center rounded-lg border transition ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Cor</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {COLOR_OPTIONS.map((option) => {
                const isActive = color === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`h-6 w-full rounded-md border-2 transition ${option.className} ${
                      isActive ? "ring-2 ring-slate-900/20 ring-offset-1" : "opacity-70"
                    }`}
                    aria-label={`Selecionar cor ${option.value}`}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Salvando..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium text-red-500">{children}</p>;
}