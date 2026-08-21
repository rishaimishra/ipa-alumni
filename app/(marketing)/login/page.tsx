"use client";

import { useActionState } from "react";
import { requestLoginOtp, type SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SimpleState = undefined;

export default function LoginPage() {
  const [state, action, pending] = useActionState(requestLoginOtp, initialState);

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your registered phone number to receive a login OTP.
      </p>

      {state?.message && (
        <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" required className="mt-1" />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send OTP"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Administrator?{" "}
        <a href="/admin-login" className="underline">
          Login here
        </a>
        .
      </p>
    </div>
  );
}
