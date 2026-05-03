export function requireAuth(ctx: any) {
  if (!ctx.userId) {
    throw new Error("Usuário não autenticado");
  }

  return ctx.userId;
}