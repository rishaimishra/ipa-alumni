"use client";

import { useTransition } from "react";
import { updateUserRole, updateUserStatus } from "@/app/actions/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  "ALUMNI",
  "STUDENT",
  "EMPLOYER",
  "PUBLIC_VISITOR",
  "ADMIN",
  "MODERATOR",
] as const;
const STATUSES = ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"] as const;

export function UserRoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={role}
      disabled={pending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() => {
          updateUserRole(userId, value);
        });
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function UserStatusSelect({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() => {
          updateUserStatus(userId, value);
        });
      }}
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
