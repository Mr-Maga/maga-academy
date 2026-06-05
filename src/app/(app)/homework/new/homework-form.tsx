"use client";

import { useActionState, useState } from "react";
import { LEVELS, SKILLS } from "@/lib/constants";
import type { Group } from "@/lib/types";
import { createHomework, type HwState } from "../actions";

export function HomeworkForm({ groups }: { groups: Pick<Group, "id" | "name" | "level">[] }) {
  const [state, action, pending] = useActionState<HwState, FormData>(createHomework, undefined);
  const [level, setLevel] = useState("");

  const visibleGroups = groups.filter((g) => !level || g.level === level);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="title">Title</label>
        <input id="title" name="title" required className="input" placeholder="e.g. Reading: True/False/Not Given" />
      </div>

      <div>
        <label className="label" htmlFor="description">Instructions</label>
        <textarea id="description" name="description" rows={4} className="input" placeholder="What should students do?" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="level">Level</label>
          <select
            id="level"
            name="level"
            required
            defaultValue=""
            className="input"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="" disabled>Choose…</option>
            {LEVELS.map((l) => (
              <option key={l.key} value={l.key}>{l.short} · {l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="skill">Skill</label>
          <select id="skill" name="skill" defaultValue="" className="input">
            <option value="">Any / general</option>
            {SKILLS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="group_id">Group (optional)</label>
        <select id="group_id" name="group_id" defaultValue="" className="input">
          <option value="">Whole level (all groups)</option>
          {visibleGroups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="due_at">Deadline</label>
        <input id="due_at" name="due_at" type="datetime-local" className="input" />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Assigning…" : "Assign homework"}
      </button>
    </form>
  );
}
