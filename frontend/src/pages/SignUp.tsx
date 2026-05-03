import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations/login";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, LogInIcon } from "lucide-react";
import { AuthContainer } from "../components/AuthContainer";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import type { LoginResponse } from "../types/auth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
    name: string;
    email: string;
    password: string;
};

export function SignUp() {
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

                toast.success("Conta criada com sucesso!");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 800);
            } else {
                toast.error("Falha ao criar conta");
            }
        } catch {
            toast.error("Erro ao criar conta");
        }
    }

    return (
        <AuthContainer>
            <Toaster position="top-center" />
            <div className="flex flex-col w-full max-w-md mx-auto px-4 md:px-0 py-8">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Criar conta
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 mt-2">
                        Comece a controlar suas finanças ainda hoje
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <Input
                            placeholder="Seu nome completo"
                            icon={<User size={20} />}
                            error={!!errors.name && isSubmitted}
                            {...register("name", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <Input
                            placeholder="mail@exemplo.com"
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
                            placeholder="Crie uma senha"
                            type="password"
                            icon={<Lock size={20} />}
                            error={!!errors.password && isSubmitted}
                            {...register("password", { required: true, minLength: 8 })}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            A senha deve conter pelo menos 8 caracteres.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Carregando..." : "Cadastrar"}
                    </Button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300" />
                    <span className="mx-4 text-sm text-gray-400">ou</span>
                    <div className="flex-grow border-t border-gray-300" />
                </div>

                <p className="text-sm text-gray-500 mb-4 text-center">
                    Já tem uma conta?
                </p>

                <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    icon={<LogInIcon size={20} />}
                    iconPosition="left"
                >
                    Fazer Login
                </Button>
            </div>
        </AuthContainer>
    );
}