"use client";

import { useActionState } from "react";
import { requestPhysicalCard } from "@/app/actions/id-card";
import type { SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SimpleState = undefined;

export function PhysicalCardForm() {
  const [state, action, pending] = useActionState(requestPhysicalCard, initialState);

  return (
    <form action={action} className="mt-3 flex flex-col gap-3">
      {state?.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}
      <div>
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Textarea
          id="deliveryAddress"
          name="deliveryAddress"
          required
          rows={3}
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Submitting..." : "Request Physical Card"}
      </Button>
    </form>
  );
}
