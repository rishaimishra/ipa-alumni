import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        IPAM Alumni Registration &amp; Data Management System
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Register, verify, and stay connected with the IPAM alumni network —
        events, job opportunities, and institutional updates in one place.
      </p>
      <div className="flex gap-4">
        <Button render={<a href="/register" />}>Register as Alumni</Button>
        <Button variant="outline" render={<a href="/login" />}>
          Login
        </Button>
      </div>
    </section>
  );
}
