import { Stack } from "../components/ds";
import { THEMES, type ThemeName } from "../styles/themes";

/** Troca o data-theme do <html>: prova que a camada de tema é só identidade. */
export function ThemeSwitcher({ value, onChange }: { value: ThemeName; onChange: (t: ThemeName) => void }) {
  return (
    <fieldset>
      <Stack direction="row" gap={4} align="center" wrap>
        <legend className="float-left type-micro text-ink-muted">Tema</legend>
        {THEMES.map((t) => (
          <label key={t.id} className="inline-flex min-h-(--touch-target) cursor-pointer items-center gap-2 type-button">
            <input
              type="radio"
              name="theme"
              value={t.id}
              checked={value === t.id}
              onChange={() => onChange(t.id)}
              className="size-4 accent-(--color-ink)"
            />
            {t.label}
          </label>
        ))}
      </Stack>
    </fieldset>
  );
}
