"use client";

import { useActionState } from "react";
import { createBannerAction } from "@/app/actions/ads";
import type { SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SimpleState = undefined;

export function BannerForm() {
  const [state, action, pending] = useActionState(createBannerAction, initialState);

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
          <Label htmlFor="linkUrl">Destination URL</Label>
          <Input
            id="linkUrl"
            name="linkUrl"
            type="url"
            placeholder="https://..."
            required
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="image">Banner Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Uploading..." : "Create Banner"}
      </Button>
    </form>
  );
}
