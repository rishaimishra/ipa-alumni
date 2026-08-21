import QRCode from "qrcode";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getAppOrigin } from "@/lib/url";
import {
  getOrCreateVirtualCard,
  getMyPhysicalCardRequest,
} from "@/lib/services/id-card-service";
import { IdCardVisual } from "@/components/id-card-visual";
import { PhysicalCardForm } from "./physical-card-form";

export default async function IdCardPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    include: { alumniProfile: true },
  });

  const card = await getOrCreateVirtualCard(user.id);

  const origin = await getAppOrigin();
  const verifyUrl = `${origin}/verify-card/${card.cardNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });

  const physicalRequest = await getMyPhysicalCardRequest(user.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-10">
      <h1 className="self-start text-2xl font-semibold">My Alumni ID Card</h1>

      <IdCardVisual
        fullName={user.alumniProfile?.fullName ?? user.phone}
        programOfStudy={user.alumniProfile?.programOfStudy}
        degreeType={user.alumniProfile?.degreeType}
        yearFrom={user.alumniProfile?.yearFrom}
        yearTo={user.alumniProfile?.yearTo}
        role={user.role}
        cardNumber={card.cardNumber}
        status={user.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
        qrDataUrl={qrDataUrl}
      />

      <div className="w-full max-w-sm rounded-xl border p-5">
        <h2 className="font-medium">Physical Card</h2>
        {physicalRequest ? (
          <div className="mt-3 text-sm">
            <p>
              Status:{" "}
              <span className="font-medium">{physicalRequest.status}</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Payment verified:{" "}
              {physicalRequest.paymentVerified ? "Yes" : "Pending"}
            </p>
            <p className="mt-1 text-muted-foreground">
              Delivery address: {physicalRequest.deliveryAddress}
            </p>
          </div>
        ) : (
          <PhysicalCardForm />
        )}
      </div>
    </div>
  );
}
