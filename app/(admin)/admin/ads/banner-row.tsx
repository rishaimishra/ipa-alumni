"use client";

import { useTransition } from "react";
import { toggleBannerActive, deleteBannerAction } from "@/app/actions/ads";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/badge";

export function BannerActions({ id, isActive }: { id: string; isActive: boolean }) {
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
        onClick={() => startTransition(() => toggleBannerActive(id, !isActive))}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => deleteBannerAction(id))}
      >
        Delete
      </Button>
    </div>
  );
}
