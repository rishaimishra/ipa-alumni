"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/app/actions/announcements";
import type { SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: SimpleState = undefined;

export function AnnouncementForm() {
  const [state, action, pending] = useActionState(
    createAnnouncementAction,
    initialState
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      {state?.message && (
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {state.message}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue="ANNOUNCEMENT">
            <SelectTrigger id="type" className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
              <SelectItem value="EVENT">Event</SelectItem>
              <SelectItem value="DEADLINE">Deadline</SelectItem>
              <SelectItem value="NEWS">News</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="body">Message</Label>
        <Textarea id="body" name="body" required rows={3} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="endsAt">Expires (optional)</Label>
        <Input id="endsAt" name="endsAt" type="datetime-local" className="mt-1" />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Publishing..." : "Publish Announcement"}
      </Button>
    </form>
  );
}
