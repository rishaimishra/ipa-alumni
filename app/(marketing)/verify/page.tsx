import { Suspense } from "react";
import { VerifyForm } from "./verify-form";

export default function VerifyPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold">Verify Your Phone</h1>
      <Suspense fallback={<p className="mt-1 text-sm text-muted-foreground">Loading...</p>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
