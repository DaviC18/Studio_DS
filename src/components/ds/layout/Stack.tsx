import type { ReactNode } from "react";
import { cx } from "../../../lib/cx";
import { GAP, type Space } from "./space";

export type StackProps = {
  children: ReactNode;
  /** column-to-row: coluna no mobile, linha a partir de lg. */
  direction?: "column" | "row" | "column-to-row";
  gap: Space;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  /** dl: filhos devem ser <div> com <dt>/<dd> dentro. */
  as?: "div" | "ul" | "ol" | "dl";
};

const DIRECTION = {
  column: "flex-col",
  row: "flex-row",
  "column-to-row": "flex-col lg:flex-row",
} as const;

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Pilha flex: dona do espaço entre componentes irmãos. */
export function Stack({
  children,
  direction = "column",
  gap,
  align = "stretch",
  justify = "start",
  wrap = false,
  as: Tag = "div",
}: StackProps) {
  return (
    <Tag
      className={cx(
        "flex",
        DIRECTION[direction],
        GAP[gap],
        ALIGN[align],
        JUSTIFY[justify],
        wrap && "flex-wrap",
      )}
    >
      {children}
    </Tag>
  );
}
