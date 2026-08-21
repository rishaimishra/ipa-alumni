"use client";

import { useActionState } from "react";
import { adminLogin, type SimpleState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SimpleState = undefined;

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, initialState);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Admin Login</h1>

      {state?.message && (
        <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
