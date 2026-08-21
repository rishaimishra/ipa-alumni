import { getCardForVerification } from "@/lib/services/id-card-service";

export default async function VerifyCardPage({
  params,
}: {
  params: Promise<{ cardNumber: string }>;
}) {
  const { cardNumber } = await params;

  const card = await getCardForVerification(cardNumber);

  if (!card) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-700">
          Card Not Found
        </div>
        <p className="text-sm text-muted-foreground">
          No IPAM alumni ID card matches this code.
        </p>
      </div>
    );
  }

  const isActive = card.user.status === "ACTIVE";

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        className={`rounded-full px-4 py-1 text-sm font-medium ${
          isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Valid IPAM Alumni ID" : "Card Not Active"}
      </div>
      <h1 className="text-xl font-semibold">
        {card.user.alumniProfile?.fullName ?? "—"}
      </h1>
      <p className="text-sm text-muted-foreground">{card.user.role}</p>
      {card.user.alumniProfile?.programOfStudy && (
        <p className="text-sm text-muted-foreground">
          {card.user.alumniProfile.programOfStudy}
        </p>
      )}
      {(card.user.alumniProfile?.yearFrom || card.user.alumniProfile?.yearTo) && (
        <p className="text-sm text-muted-foreground">
          {card.user.alumniProfile?.yearFrom ?? "—"} -{" "}
          {card.user.alumniProfile?.yearTo ?? "—"}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{card.cardNumber}</p>
    </div>
  );
}
