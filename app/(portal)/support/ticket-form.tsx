"use client";

import { useActionState } from "react";
import { createTicket } from "@/app/actions/tickets";
import type { SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SimpleState = undefined;

export function TicketForm() {
  const [state, action, pending] = useActionState(createTicket, initialState);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4 rounded border p-4">
      {state?.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={4} className="mt-1" />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Submitting..." : "Submit Ticket"}
      </Button>
    </form>
  );
}
