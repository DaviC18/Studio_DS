#!/usr/bin/env node
// PreToolUse (Skill): uso restrito da impeccable neste projeto (SPEC §11).
// Só passam os comandos de avaliação e acabamento; criar estética (bolder,
// colorize, overdrive, delight, animate, typeset, layout…), pedido livre e a
// chamada sem comando são negados. As regras `Skill(args:…)` do settings.json
// cobrem os comandos por nome; este hook fecha o resto (lista branca, sem
// diferença de maiúscula).
const ALLOWED = new Set(["critique", "audit", "harden", "clarify", "polish", "document"]);

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw).tool_input ?? {};
const skill = String(input.skill ?? "").replace(/^\//, "");
if (skill !== "impeccable" && !skill.endsWith(":impeccable")) process.exit(0);

const command = String(input.args ?? "")
  .trim()
  .split(/\s+/)[0]
  .replace(/^\//, "")
  .toLowerCase();
if (ALLOWED.has(command)) process.exit(0);

const reason =
  `impeccable restrita neste projeto: só ${[...ALLOWED].join(", ")}. ` +
  `"${command || "(sem comando)"}" não é permitido (SPEC §11). Mudança estética passa pelo diretor.`;
console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  }),
);
