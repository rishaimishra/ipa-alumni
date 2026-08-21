"use client";

import { useState, useTransition } from "react";
import { dismissAnnouncement } from "@/app/actions/announcements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: string;
  title: string;
  body: string;
  type: string;
};

export function AnnouncementPopup({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [queue, setQueue] = useState(announcements);
  const [pending, startTransition] = useTransition();
  const current = queue[0];

  if (!current) return null;

  function handleDismiss() {
    startTransition(async () => {
      await dismissAnnouncement(current.id);
      setQueue((prev) => prev.slice(1));
    });
  }

  return (
    <Dialog open={Boolean(current)} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <Badge>{current.type}</Badge>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.body}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDismiss} disabled={pending}>
            {pending ? "Dismissing..." : "Got it"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
