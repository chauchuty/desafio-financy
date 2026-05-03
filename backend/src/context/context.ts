import { verifyToken } from "../utils/auth";

export function createContext({ req }: any) {
  const auth = req.headers.authorization || "";

  if (!auth) return {};

  try {
    const token = auth.replace("Bearer ", "");
    const decoded: any = verifyToken(token);

    return { userId: decoded.userId };
  } catch {
    return {};
  }
}