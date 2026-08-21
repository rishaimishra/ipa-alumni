"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOtpAndSignIn, type SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SimpleState = undefined;

export function VerifyForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const [state, action, pending] = useActionState(verifyOtpAndSignIn, initialState);

  return (
    <>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 6-digit code sent to {phone || "your phone"}.
      </p>

      {state?.message && (
        <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <form action={action} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="phone" value={phone} />
        <div>
          <Label htmlFor="code">OTP Code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            maxLength={6}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>
    </>
  );
}
