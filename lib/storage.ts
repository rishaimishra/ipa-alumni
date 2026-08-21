import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Dev implementation writes to public/uploads and returns a same-origin path.
 * Swap the body for an S3 PutObject call (returning the CloudFront URL) at
 * deployment time without touching any call site.
 */
export async function saveUploadedFile(file: File, folder: string): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || "";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${folder}/${filename}`;
}
