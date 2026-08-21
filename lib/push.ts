import "server-only";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const hasFirebase = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
);

if (!hasFirebase && process.env.NODE_ENV !== "production") {
  console.warn(
    "[push] FIREBASE_* env vars not set — push sends are logged to this console instead of delivered."
  );
}

function getFirebaseMessaging() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getMessaging();
}

export async function sendPushToTokens(
  tokens: string[],
  notification: { title: string; body: string }
): Promise<void> {
  if (tokens.length === 0) return;

  if (!hasFirebase) {
    console.log(
      `[DEV PUSH] to ${tokens.length} device(s): "${notification.title}" — ${notification.body}`
    );
    return;
  }

  const messaging = getFirebaseMessaging();
  const result = await messaging.sendEachForMulticast({ tokens, notification });
  if (result.failureCount > 0) {
    console.error(`[push] ${result.failureCount} of ${tokens.length} sends failed.`);
  }
}
