import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * false no servidor e durante a hidratação; true logo depois. Para valores que
 * só o browser sabe (estilos computados, medidas): o HTML pré-renderizado e o
 * primeiro render do cliente ficam iguais, e o valor real entra em seguida.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
