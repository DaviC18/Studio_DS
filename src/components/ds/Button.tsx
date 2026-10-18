import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";

export type ButtonVariant = "primary" | "ghost" | "link";

type Common = {
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
};

// Sem className/style: visual só por variante (tokens).
type Blocked = "className" | "style" | "children";

export type ButtonAsLink = Common & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    Blocked | "href"
  >;

export type ButtonAsButton = Common & {
  href?: never;
  type?: "button" | "submit" | "reset";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, Blocked | "type" | "disabled">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const ROOT =
  "group relative isolate inline-flex min-h-(--touch-target) items-center justify-center overflow-clip type-button";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "rounded-(--button-radius) bg-(--button-primary-bg) px-6 py-2 text-(--button-primary-ink)",
  ghost:
    "rounded-(--button-radius) border border-(--button-ghost-border) px-6 py-2 text-(--button-ghost-ink)",
  link: "text-(--button-link-ink)",
};

// Camada que sobe no hover/foco. Só transform (SPEC §5.3).
const HOVER_LAYER: Partial<Record<ButtonVariant, string>> = {
  primary: "bg-(--button-primary-hover-bg)",
  ghost: "bg-(--button-ghost-hover-bg)",
};

const TRANSITION =
  "transition-transform duration-fast ease-snap motion-reduce:transition-none";

function Content({ variant, disabled, children }: Required<Omit<Common, "children">> & { children: ReactNode }) {
  const layer = HOVER_LAYER[variant];
  return (
    <>
      {layer && !disabled && (
        <span
          aria-hidden="true"
          className={cx(
            "absolute inset-0 -z-10 translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0",
            layer,
            TRANSITION,
          )}
        />
      )}
      <span className="relative">
        {children}
        {variant === "link" && (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-1 h-(--line-width) bg-(--button-link-line)"
            />
            {!disabled && (
              <span
                aria-hidden="true"
                className={cx(
                  "absolute inset-x-0 -bottom-1 h-(--line-width) origin-left scale-x-0 bg-(--button-link-line-hover) group-hover:scale-x-100 group-focus-visible:scale-x-100",
                  TRANSITION,
                )}
              />
            )}
          </>
        )}
      </span>
    </>
  );
}

/** CTA. Com `href` vira <a>; sem, <button>. `disabled` desativa de verdade. */
export function Button(props: ButtonProps) {
  const { variant = "primary", disabled = false, children } = props;
  const className = cx(
    ROOT,
    VARIANT[variant],
    disabled && "cursor-not-allowed opacity-(--button-disabled-opacity)",
  );
  const content = (
    <Content variant={variant} disabled={disabled}>
      {children}
    </Content>
  );

  if (props.href !== undefined) {
    const { href, variant: _variant, disabled: _disabled, children: _children, ...rest } = props;
    if (disabled) {
      // Link desativado: sem href não navega nem recebe foco.
      return (
        <a {...rest} role="link" aria-disabled="true" className={className}>
          {content}
        </a>
      );
    }
    return (
      <a {...rest} href={href} className={className}>
        {content}
      </a>
    );
  }

  const { type = "button", variant: _variant, disabled: _disabled, children: _children, ...rest } = props;
  return (
    <button {...rest} type={type} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
