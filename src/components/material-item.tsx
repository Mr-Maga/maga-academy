import { FileDown, Video, Trash2 } from "lucide-react";
import { Badge, LevelChip } from "@/components/ui";
import { SubmitButton } from "@/components/form-controls";
import { SKILL_MAP } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Material } from "@/lib/types";
import { deleteMaterial } from "@/app/(app)/materials/actions";

export function MaterialItem({
  material,
  fileUrl,
  canManage = false,
  showLevel = false,
}: {
  material: Material;
  fileUrl?: string | null;
  canManage?: boolean;
  showLevel?: boolean;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{material.title}</h3>
          {material.description && <p className="mt-0.5 text-sm text-muted">{material.description}</p>}
        </div>
        {canManage && (
          <form action={deleteMaterial}>
            <input type="hidden" name="material_id" value={material.id} />
            <input type="hidden" name="file_path" value={material.file_path ?? ""} />
            <SubmitButton className="text-danger" pendingLabel="…">
              <Trash2 className="h-4 w-4" />
            </SubmitButton>
          </form>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <Badge tone="primary">{SKILL_MAP[material.skill].emoji} {SKILL_MAP[material.skill].label}</Badge>
        {showLevel && <LevelChip level={material.level} />}
        <span className="text-subtle">{formatDate(material.created_at)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-sm">
            <FileDown className="h-4 w-4" /> Download
          </a>
        )}
        {material.video_url && (
          <a href={material.video_url} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-sm text-teal">
            <Video className="h-4 w-4" /> Watch video
          </a>
        )}
      </div>
    </div>
  );
}
