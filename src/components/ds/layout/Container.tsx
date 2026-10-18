import type { ReactNode } from "react";
import { cx } from "../../../lib/cx";
import { GAP_Y, type Space } from "./space";

/**
 * Como os filhos ocupam o grid a partir de lg (no mobile, sempre largura total):
 * full = 12, split = 6 + 6, thirds = 4 + 4 + 4, main-aside = 8 + 4.
 */
export type ContainerLayout = "full" | "split" | "thirds" | "main-aside";

export type ContainerProps = {
  children: ReactNode;
  layout?: ContainerLayout;
  /** Espaço vertical entre linhas do grid. */
  gap?: Space;
  as?: "div" | "ul" | "ol";
};

const LAYOUT: Record<ContainerLayout, string> = {
  full: "*:col-span-full",
  split: "*:col-span-full lg:*:col-span-6",
  thirds: "*:col-span-full lg:*:col-span-4",
  "main-aside": "*:col-span-full lg:*:odd:col-span-8 lg:*:even:col-span-4",
};

/** Margem lateral do SPEC §4 + grid de 4/12 colunas. */
export function Container({ children, layout = "full", gap = 8, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cx("page-grid", GAP_Y[gap], LAYOUT[layout])}>{children}</Tag>;
}
