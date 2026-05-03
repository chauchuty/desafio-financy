import {
  Tag,
  UtensilsCrossed,
  CarFront,
  ShoppingCart,
  ShoppingBasket,
  Home,
  BriefcaseBusiness,
  Landmark,
  HeartPulse,
  PiggyBank,
  Package,
  Sparkles,
  PawPrint,
  Truck,
  CircleDollarSign,
  CreditCard,
  Apple,
} from "lucide-react";

export const CATEGORY_COLORS = ["emerald", "blue", "violet", "pink", "red", "orange", "amber"] as const;

export const CATEGORY_COLOR_TONES: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  pink: "bg-pink-100 text-pink-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  amber: "bg-amber-100 text-amber-700",
};

export const CATEGORIES_TONES = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-red-100 text-red-700",
  "bg-cyan-100 text-cyan-700",
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Alimentação: "Restaurantes, delivery e refeições",
  Transporte: "Gasolina, transporte público e viagens",
  Mercado: "Compras de supermercado e mantimentos",
  Entretenimento: "Cinema, lazer e assinaturas",
  Utilidades: "Energia, água, internet e telefone",
  Salário: "Renda mensal e bonificações",
  Saúde: "Medicamentos, consultas e exames",
  Casa: "Moradia e despesas domésticas",
  Investimento: "Aplicações e aportes financeiros",
  Serviços: "Prestadores, taxas e manutenções",
  Receita: "Entradas financeiras registradas",
  Pagamentos: "Cartões, boletos e cobranças",
  Pets: "Cuidados e despesas com animais",
  Entrega: "Envios, entregas e fretes",
  Compras: "Compras em geral",
};

export const CATEGORY_ICON_IDS: Record<string, string> = {
  Alimentação: "utensils",
  Transporte: "car",
  Mercado: "basket",
  Entretenimento: "sparkles",
  Utilidades: "bank",
  Salário: "briefcase",
  Saúde: "heart",
  Casa: "home",
  Investimento: "piggy",
  Serviços: "package",
  Receita: "dollar",
  Pagamentos: "card",
  Pets: "paw",
  Entrega: "truck",
  Compras: "shopping",
  Geral: "tag",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

export function getCategoryTone(index: number) {
  return CATEGORIES_TONES[index % CATEGORIES_TONES.length];
}

export function getCategoryToneByColor(color?: string, index = 0) {
  if (!color) {
    return getCategoryTone(index);
  }

  return CATEGORY_COLOR_TONES[color] ?? getCategoryTone(index);
}

export function getCategoryIconById(iconId: string) {
  const icons: Record<string, typeof Tag> = {
    tag: Tag,
    utensils: UtensilsCrossed,
    car: CarFront,
    shopping: ShoppingCart,
    basket: ShoppingBasket,
    home: Home,
    briefcase: BriefcaseBusiness,
    bank: Landmark,
    heart: HeartPulse,
    piggy: PiggyBank,
    package: Package,
    sparkles: Sparkles,
    paw: PawPrint,
    truck: Truck,
    dollar: CircleDollarSign,
    card: CreditCard,
    apples: Apple,
  };

  return icons[iconId] ?? Tag;
}

