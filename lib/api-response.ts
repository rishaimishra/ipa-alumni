import { NextResponse } from "next/server";
import { httpStatusForError, ValidationError } from "@/lib/errors";

export function errorResponse(error: unknown) {
  const status = httpStatusForError(error);
  const message = error instanceof Error ? error.message : "Something went wrong.";
  const body: { error: string; fieldErrors?: Record<string, string[]> } = {
    error: message,
  };
  if (error instanceof ValidationError && error.fieldErrors) {
    body.fieldErrors = error.fieldErrors;
  }
  return NextResponse.json(body, { status });
}
