import { useGame } from '@store/gameStore';
import { AGENT_ROLES, getRole, maxSlots } from '@engine/index';
import type { AgentRole } from '@engine/index';

export function AgentPanel() {
  const state = useGame((s) => s.state);
  const { hire, fire, setPriority } = useGame();

  if (!state.flags['agents']) {
    return (
      <p className="rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
        Treine o modelo <b>Foundation</b> (tier 4) para empregar Agentes que
        automatizam os verbos.
      </p>
    );
  }

  const slots = maxSlots(state);
  const used = state.agents.length;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Agentes</h2>
        <span className="font-mono text-xs text-muted">
          {used}/{slots} slots
        </span>
      </div>

      {/* hire buttons */}
      <div className="flex flex-wrap gap-1.5">
        {AGENT_ROLES.map((role) => {
          const canHire = used < slots && verbEnabled(state.flags, role.role);
          return (
            <button
              key={role.role}
              disabled={!canHire}
              onClick={() => hire(role.role)}
              className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs transition enabled:hover:border-accent disabled:opacity-40"
              title={role.desc}
            >
              <span>{role.icon}</span>
              <span>+ {role.name}</span>
            </button>
          );
        })}
      </div>

      {/* active agents */}
      <div className="grid grid-cols-1 gap-1.5">
        {state.agents.map((a) => {
          const def = getRole(a.role);
          return (
            <div key={a.id} className="rounded-lg border border-border bg-surface-2 p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {def.icon} {def.name}
                </span>
                <button
                  onClick={() => fire(a.id)}
                  className="text-xs text-muted transition hover:text-danger"
                >
                  demitir
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted">prioridade</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={a.priority}
                  onChange={(e) => setPriority(a.id, Number(e.target.value))}
                  className="h-1 flex-1 cursor-pointer accent-[var(--accent)]"
                />
                <span className="w-8 text-right font-mono text-[10px]">
                  {Math.round(a.priority * 100)}%
                </span>
              </div>
            </div>
          );
        })}
        {used === 0 && <p className="px-1 text-[11px] text-muted">Nenhum agente empregado.</p>}
      </div>
    </section>
  );
}

function verbEnabled(flags: Record<string, boolean>, role: AgentRole): boolean {
  const need: Record<AgentRole, string> = {
    thinker: 'verb:think',
    investigator: 'verb:investigate',
    collector: 'data',
    analyst: 'verb:analyze',
    planner: 'verb:plan',
  };
  return !!flags[need[role]];
}
