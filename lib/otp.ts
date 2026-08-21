import "server-only";
import twilio from "twilio";

const hasTwilio = Boolean(
  process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_VERIFY_SERVICE_SID
);

const devOtpStore = new Map<string, { code: string; expiresAt: number }>();
const DEV_OTP_TTL_MS = 10 * 60 * 1000;

if (!hasTwilio && process.env.NODE_ENV !== "production") {
  console.warn(
    "[otp] TWILIO_* env vars not set — using an in-memory dev OTP fallback. Codes are logged to this console, not sent by SMS."
  );
}

function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
}

export async function sendOtp(phone: string): Promise<void> {
  if (hasTwilio) {
    const client = getTwilioClient();
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  devOtpStore.set(phone, { code, expiresAt: Date.now() + DEV_OTP_TTL_MS });
  console.log(`[DEV OTP] ${phone} -> ${code}`);
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  if (hasTwilio) {
    const client = getTwilioClient();
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: phone, code });
    return check.status === "approved";
  }

  const entry = devOtpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    devOtpStore.delete(phone);
    return false;
  }
  const ok = entry.code === code;
  if (ok) devOtpStore.delete(phone);
  return ok;
}
