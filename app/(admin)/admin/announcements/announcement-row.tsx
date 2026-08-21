"use client";

import { useTransition } from "react";
import {
  toggleAnnouncementActive,
  deleteAnnouncementAction,
} from "@/app/actions/announcements";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/badge";

export function AnnouncementActions({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Badge color={isActive ? "success" : "light"}>
        {isActive ? "ACTIVE" : "INACTIVE"}
      </Badge>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => toggleAnnouncementActive(id, !isActive))}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => deleteAnnouncementAction(id))}
      >
        Delete
      </Button>
    </div>
  );
}
