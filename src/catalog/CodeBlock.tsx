/** Snippet de uso. Rolável por teclado (tabIndex) quando passa da largura. */
export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="overflow-x-auto rounded-base border border-line bg-surface p-4 font-code type-micro"
    >
      <code className="font-code">{code.trim()}</code>
    </pre>
  );
}
