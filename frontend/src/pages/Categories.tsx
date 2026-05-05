import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { Plus, Wallet, Tag, Repeat2 } from "lucide-react";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction";
import { ME } from "../graphql/queries/me";
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "../graphql/mutations/category";
import type { GetCategoriesResponse, Category } from "../types/category";
import type { GetTransactionsResponse } from "../types/transaction";
import type { MeResponse } from "../types/user";
import {
  CategoryModal,
  type CategoryModalInitialValues,
  type CategoryModalValues,
} from "../components/categories/CategoryModal";
import { CategoryCard, type CategoryCardData } from "../components/categories/CategoryCard";
import { SummaryCard } from "../components/categories/SummaryCard";
import { SummaryHighlight } from "../components/categories/SummaryHighlight";
import { CategoriesSkeleton } from "../components/categories/CategoriesSkeleton";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_ICON_IDS,
  getCategoryColor,
  getCategoryToneByColor,
  getCategoryIconById,
} from "../components/categories/categoriesUtils";

type CreateCategoryResponse = {
  createCategory: Category;
};

type CreateCategoryVariables = {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
};

type UpdateCategoryResponse = {
  updateCategory: Category;
};

type UpdateCategoryVariables = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
};

type CategoryDraft = CategoryModalInitialValues & {
  id?: string;
};

// Client-side map to remember custom colors for categories (set at create/edit time)
const CATEGORY_COLOR_MAP: Record<string, string> = {};

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

export function Categories() {
  const [activeCategory, setActiveCategory] = useState<CategoryDraft | null>(null);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<GetCategoriesResponse>(GET_CATEGORIES);
  const { data: transactionsData, loading: transactionsLoading } = useQuery<GetTransactionsResponse>(GET_TRANSACTIONS);
  const { data: meData, loading: meLoading } = useQuery<MeResponse>(ME);
  const [createCategory] = useMutation<CreateCategoryResponse, CreateCategoryVariables>(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
    awaitRefetchQueries: true,
  });
  const [updateCategory] = useMutation<UpdateCategoryResponse, UpdateCategoryVariables>(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
    awaitRefetchQueries: true,
  });
  const [deleteCategory] = useMutation<{ deleteCategory: boolean }, { id: string }>(DELETE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
    awaitRefetchQueries: true,
  });

  const [deletingCategory, setDeletingCategory] = useState<CategoryCardData | null>(null);

  const categories = categoriesData?.categories ?? [];
  const transactions = transactionsData?.transactions ?? [];

  const userName = meData?.me.name ?? "Usuário";
  const userInitials = getInitials(userName);

  const categorySummary = useMemo(
    () =>
      categories.map((category, index) => {
        const relatedTransactions = transactions.filter(
          (transaction) => transaction.category?.name === category.name,
        );

        const total = relatedTransactions.reduce(
          (sum, transaction) => sum + Math.abs(transaction.amount),
          0,
        );

        return {
          id: category.id,
          name: category.name,
          description: category.description ?? CATEGORY_DESCRIPTIONS[category.name] ?? "Categoria personalizada",
          icon: getCategoryIconById(category.icon ?? CATEGORY_ICON_IDS[category.name] ?? "tag"),
          iconId: category.icon ?? CATEGORY_ICON_IDS[category.name] ?? "tag",
          color: category.color ?? CATEGORY_COLOR_MAP[category.name] ?? getCategoryColor(index),
          tone: getCategoryToneByColor(category.color ?? CATEGORY_COLOR_MAP[category.name] ?? getCategoryColor(index), index),
          count: relatedTransactions.length,
          total,
        } as CategoryCardData;
      }),
    [categories, transactions],
  );

  const totalCategories = categories.length;
  const totalTransactions = transactions.length;
  const topCategory = [...categorySummary].sort((left, right) => right.count - left.count)[0];
  const TopCategoryIcon = topCategory?.icon ?? Tag;
  const modalOpen = activeCategory !== null;

  if (categoriesLoading || transactionsLoading || meLoading) {
    return <CategoriesSkeleton />;
  }

  async function handleCreateCategory(values: CategoryModalValues) {
    const { data } = await createCategory({
      variables: { name: values.name, description: values.description, color: values.color, icon: values.icon },
    });

    const createdCategory = data?.createCategory;

    if (createdCategory) {
      // remember chosen color on the client so the list reflects user's selection
      CATEGORY_COLOR_MAP[createdCategory.name] = values.color;
    }
  }

  async function handleUpdateCategory(values: CategoryModalValues) {
    if (!activeCategory?.id) {
      return;
    }

    const { data } = await updateCategory({
      variables: {
        id: activeCategory.id,
        name: values.name,
        description: values.description,
        color: values.color,
        icon: values.icon,
      },
    });

    const updatedCategory = data?.updateCategory;

    if (updatedCategory) {
      // update client-side color mapping when editing
      CATEGORY_COLOR_MAP[updatedCategory.name] = values.color;
      setActiveCategory(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return;

    try {
      await deleteCategory({ variables: { id: deletingCategory.id } });
      // clear client-side mapping for removed category
      delete CATEGORY_COLOR_MAP[deletingCategory.name];
    } finally {
      setDeletingCategory(null);
    }
  }

  function openCreateModal() {
    setActiveCategory({
      name: "",
      description: "",
      icon: "tag",
      color: "emerald",
    });
  }

  function openEditModal(category: CategoryCardData) {
    setActiveCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.iconId,
      color: category.color,
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
            <Link className="transition-colors hover:text-slate-800" to="/dashboard">
              Dashboard
            </Link>
            <Link className="transition-colors hover:text-slate-800" to="/transactions">
              Transações
            </Link>
            <span className="flex items-center gap-2 text-emerald-700">Categorias</span>
          </nav>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            {userInitials}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Categorias</h1>
            <p className="mt-1 text-sm text-slate-500">Organize suas transações por categorias</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-700/20 transition hover:bg-emerald-800"
          >
            <Plus size={18} />
            Nova categoria
          </button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<Tag size={20} />}
            title="Total de categorias"
            value={String(totalCategories)}
          />
          <SummaryCard
            icon={<Repeat2 size={20} />}
            title="Total de transações"
            value={String(totalTransactions)}
          />
          <SummaryHighlight
            icon={<TopCategoryIcon size={20} />}
            title="Categoria mais utilizada"
            value={topCategory?.name ?? "Sem Categorias"}
          />
        </section>

        <section className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categorySummary.length > 0 ? (
            categorySummary.map((category) => (
              <CategoryCard
                key={category.id}
                data={category}
                onEdit={() => openEditModal(category)}
                onDelete={() => setDeletingCategory(category)}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
              Nenhuma categoria cadastrada.
            </div>
          )}
        </section>
      </main>

      <CategoryModal
        open={modalOpen}
        initialValues={activeCategory ?? undefined}
        title={activeCategory?.name ? "Editar categoria" : "Nova categoria"}
        submitLabel={activeCategory?.name ? "Salvar alterações" : "Salvar"}
        onClose={() => setActiveCategory(null)}
        onSubmit={activeCategory?.name ? handleUpdateCategory : handleCreateCategory}
      />
      <ConfirmModal
        open={!!deletingCategory}
        title="Deletar categoria"
        description={
          deletingCategory ? (
            <>
              Deseja realmente deletar a categoria <strong>{deletingCategory.name}</strong>? Essa ação não pode ser desfeita.
            </>
          ) : (
            undefined
          )
        }
        onCancel={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}