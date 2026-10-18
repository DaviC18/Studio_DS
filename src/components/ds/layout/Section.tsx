import type { ReactNode } from "react";
import { cx } from "../../../lib/cx";
import type { ThemeName } from "../../../styles/themes";
import { PADDING_Y, type Space } from "./space";

export type SectionProps = {
  children: ReactNode;
  as?: "section" | "header" | "footer" | "div";
  /** Padding vertical (escala do SPEC §4). */
  space?: Space;
  /** Aplica outro tema só nesta seção. */
  theme?: ThemeName;
  /** Fundo: principal ou alternado (--color-surface). */
  tone?: "bg" | "surface";
  id?: string;
  labelledBy?: string;
};

const TONE = { bg: "bg-bg", surface: "bg-surface" } as const;

/** Faixa de largura total. Dona do espaço vertical da página. */
export function Section({
  children,
  as: Tag = "section",
  space = 24,
  theme,
  tone = "bg",
  id,
  labelledBy,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-theme={theme}
      aria-labelledby={labelledBy}
      className={cx("w-full text-ink", PADDING_Y[space], TONE[tone])}
    >
      {children}
    </Tag>
  );
}
