import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { CreateTicketSchema } from "@/lib/schemas/tickets";
import { createTicket, listMyTickets } from "@/lib/services/ticket-service";
import { ValidationError } from "@/lib/errors";
import { errorResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const user = await requireApiUser(req);
    const tickets = await listMyTickets(user.id);
    return NextResponse.json({ tickets });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireApiUser(req);
    const body = await req.json();
    const parsed = CreateTicketSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid ticket details.",
        parsed.error.flatten().fieldErrors
      );
    }

    const ticket = await createTicket(user.id, parsed.data);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
