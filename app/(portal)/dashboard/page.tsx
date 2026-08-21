import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function PortalDashboardPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { alumniProfile: true },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Alumni Dashboard</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      <div className="mt-6 rounded border p-4 text-sm">
        <p>
          <span className="text-muted-foreground">Name:</span>{" "}
          {user?.alumniProfile?.fullName}
        </p>
        <p>
          <span className="text-muted-foreground">Phone:</span> {user?.phone}
        </p>
        <p>
          <span className="text-muted-foreground">Role:</span> {user?.role}
        </p>
        <p>
          <span className="text-muted-foreground">Status:</span> {user?.status}
        </p>
      </div>

      <p className="mt-6">
        <a href="/support" className="underline">
          Feedback &amp; Support Tickets
        </a>
      </p>
    </div>
  );
}
