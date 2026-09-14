import { cookies } from "next/headers";

export const COOKIE = "semeia_uid";

/**
 * Identidade anonima por cookie: a pessoa que chega pelo Instagram
 * joga o quiz sem criar conta. O id fica em cookie httpOnly, entao
 * o proprio navegador nao consegue trocar por outro via JavaScript.
 */
export async function usuarioAtual(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}
