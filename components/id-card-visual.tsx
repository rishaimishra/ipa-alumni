export function IdCardVisual({
  fullName,
  programOfStudy,
  degreeType,
  yearFrom,
  yearTo,
  role,
  cardNumber,
  status,
  qrDataUrl,
}: {
  fullName: string;
  programOfStudy?: string | null;
  degreeType?: string | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  role: string;
  cardNumber: string;
  status: "ACTIVE" | "INACTIVE";
  qrDataUrl: string;
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="text-sm font-semibold tracking-wide">IPAM ALUMNI</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            status === "ACTIVE" ? "bg-green-500/90" : "bg-red-500/90"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-lg font-semibold leading-tight">{fullName}</p>
          <p className="text-sm text-blue-100">{role}</p>
          {programOfStudy && (
            <p className="text-sm text-blue-100">{programOfStudy}</p>
          )}
          {degreeType && <p className="text-sm text-blue-100">{degreeType}</p>}
          {(yearFrom || yearTo) && (
            <p className="text-sm text-blue-100">
              {yearFrom ?? "—"} - {yearTo ?? "—"}
            </p>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`QR code for card ${cardNumber}`}
          width={96}
          height={96}
          className="rounded bg-white p-1"
        />
      </div>

      <div className="border-t border-white/20 px-5 py-3 text-xs text-blue-100">
        {cardNumber}
      </div>
    </div>
  );
}
