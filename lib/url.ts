import "server-only";
import { headers } from "next/headers";

export async function getAppOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
