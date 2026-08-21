"use client";

import { useTransition } from "react";
import { updatePhysicalCardStatus, togglePaymentVerified } from "@/app/actions/id-card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = [
  "REQUESTED",
  "PRINTING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export function PhysicalCardStatusSelect({
  requestId,
  status,
}: {
  requestId: string;
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
          updatePhysicalCardStatus(requestId, value);
        });
      }}
    >
      <SelectTrigger className="w-40">
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

export function PaymentVerifiedCheckbox({
  requestId,
  verified,
}: {
  requestId: string;
  verified: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={verified}
      disabled={pending}
      onCheckedChange={(checked) => {
        startTransition(() => {
          togglePaymentVerified(requestId, checked === true);
        });
      }}
    />
  );
}
