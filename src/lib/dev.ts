import type { ReactNode } from "react";

/** Texto vazio: null, false, "" ou só espaços. */
export function isEmptyText(node: ReactNode): boolean {
  if (node == null || typeof node === "boolean") return true;
  if (typeof node === "string") return node.trim() === "";
  return false;
}
