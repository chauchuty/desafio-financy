import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { userService } from "../services";
import type { User } from "../services";

export default function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userData = await userService.getMe();
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setLoading(false);
    } catch {
      toast.error("Erro ao carregar dados do usuário");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    try {
      await userService.updateUser({
        name,
        email,
        ...(password.trim() && { password }),
      });
      toast.success("Usuário atualizado com sucesso");
      navigate("/dashboard");
    } catch {
      toast.error("Falha ao atualizar usuário");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AppHeader activePage="account" userName={user?.name} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>Carregando...</div>
        </main>
      </div>
    );
  }

  const userName = user?.name ?? "Usuário";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader activePage="account" userName={userName} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Editar usuário</h1>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha (opcional)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="rounded-lg bg-emerald-700 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
                disabled={updating}
              >
                {updating ? "Salvando..." : "Salvar alterações"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
