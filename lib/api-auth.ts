import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import type { Role, User } from "@/app/generated/prisma/client";

const secretKey = process.env.AUTH_SECRET;
if (!secretKey) {
  throw new Error("AUTH_SECRET is required to sign/verify API tokens.");
}
const encodedSecret = new TextEncoder().encode(secretKey);

const API_TOKEN_TTL = "30d";

export async function signApiToken(user: Pick<User, "id" | "role">) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(API_TOKEN_TTL)
    .sign(encodedSecret);
}

async function verifyApiToken(token: string) {
  const { payload } = await jwtVerify(token, encodedSecret, {
    algorithms: ["HS256"],
  });
  if (typeof payload.sub !== "string") {
    throw new UnauthorizedError("Invalid token.");
  }
  return { userId: payload.sub, role: payload.role as Role };
}

function extractBearerToken(req: Request): string {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or malformed Authorization header.");
  }
  return header.slice("Bearer ".length).trim();
}

export async function requireApiUser(req: Request) {
  const token = extractBearerToken(req);

  let decoded: { userId: string };
  try {
    decoded = await verifyApiToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token.");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || user.status === "SUSPENDED") {
    throw new UnauthorizedError("Account not active.");
  }

  return user;
}

export async function requireApiRole(req: Request, roles: Role[]) {
  const user = await requireApiUser(req);
  if (!roles.includes(user.role)) {
    throw new ForbiddenError();
  }
  return user;
}
