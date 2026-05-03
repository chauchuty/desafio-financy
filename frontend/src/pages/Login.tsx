import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations/login";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Wallet, Coins } from "lucide-react";
import { AuthContainer } from "../components/ui/AuthContainer";
import { Input } from "../components/Input";
import { Button } from "../components/ui/Button";
import type { LoginResponse } from "../types/auth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

export function Login() {
  const navigate = useNavigate();
  const [login, { loading }] = useMutation<LoginResponse>(LOGIN);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await login({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      const token = response.data?.login.token;

      if (token) {
        localStorage.setItem("token", token);

        toast.success("Login realizado com sucesso!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        toast.error("Credenciais inválidas");
      }
    } catch {
      toast.error("Informações de login incorretas");
    }
  }

  return (
    <>
      
      <AuthContainer>
        <Toaster position="top-center" />

        <div className="flex flex-col w-full max-w-md mx-auto px-4 md:px-0 py-8">
          <header className="mb-8 text-center">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
              Fazer login
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Entre na sua conta para continuar
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <Input
                placeholder="exemplo@email.com"
                type="email"
                icon={<Mail size={20} />}
                error={!!errors.email && isSubmitted}
                {...register("email", { required: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                placeholder="••••••••"
                type="password"
                icon={<Lock size={20} />}
                error={!!errors.password && isSubmitted}
                {...register("password", { required: true })}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Lembrar-me
                </span>
              </label>

              <button
                type="button"
                className="text-sm font-semibold text-green-700 hover:text-green-800 hover:underline transition-all"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Entrar na conta"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm text-gray-400">ou</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <Button onClick={() => navigate("/signup")} variant="outline">
            Criar conta agora
          </Button>
        </div>
      </AuthContainer>
    </>
  );
}