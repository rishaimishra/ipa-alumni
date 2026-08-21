import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { RegisterSchema, OtpRequestSchema, OtpVerifySchema } from "@/lib/schemas/auth";
import { CreateTicketSchema } from "@/lib/schemas/tickets";
import { PhysicalCardRequestSchema } from "@/lib/schemas/id-card";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const ErrorResponse = z.object({
  error: z.string(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});

const UserSummary = z.object({
  id: z.string(),
  phone: z.string(),
  role: z.string(),
  status: z.string(),
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Register a new alumni or student account and send a verification OTP",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: RegisterSchema } } },
  },
  responses: {
    201: {
      description: "Registered — OTP sent",
      content: {
        "application/json": {
          schema: z.object({ phone: z.string(), message: z.string() }),
        },
      },
    },
    400: { description: "Validation error", content: { "application/json": { schema: ErrorResponse } } },
    409: { description: "Account already exists", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/otp/request",
  summary: "Send a login OTP to an already-registered phone number",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: OtpRequestSchema } } },
  },
  responses: {
    200: {
      description: "OTP sent",
      content: { "application/json": { schema: z.object({ message: z.string() }) } },
    },
    404: { description: "No account found", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/otp/verify",
  summary: "Verify an OTP and receive a bearer token",
  tags: ["Auth"],
  request: {
    body: { content: { "application/json": { schema: OtpVerifySchema } } },
  },
  responses: {
    200: {
      description: "Verified",
      content: {
        "application/json": {
          schema: z.object({ token: z.string(), user: UserSummary }),
        },
      },
    },
    401: { description: "Invalid or expired code", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/me",
  summary: "Get the signed-in user's profile",
  tags: ["Profile"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Current user" },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/me/id-card",
  summary: "Get the signed-in user's virtual ID card",
  tags: ["ID Card"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Virtual ID card" },
    401: { description: "Unauthorized", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/me/id-card/physical-request",
  summary: "Get the signed-in user's latest physical card request",
  tags: ["ID Card"],
  security: [{ bearerAuth: [] }],
  responses: { 200: { description: "Latest request, or null" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/me/id-card/physical-request",
  summary: "Request a physical ID card",
  tags: ["ID Card"],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: PhysicalCardRequestSchema } } },
  },
  responses: {
    201: { description: "Request created" },
    409: { description: "A request is already in progress", content: { "application/json": { schema: ErrorResponse } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/me/tickets",
  summary: "List the signed-in user's support tickets",
  tags: ["Support"],
  security: [{ bearerAuth: [] }],
  responses: { 200: { description: "List of tickets" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/me/tickets",
  summary: "Submit a support/feedback ticket",
  tags: ["Support"],
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CreateTicketSchema } } },
  },
  responses: { 201: { description: "Ticket created" } },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/verify-card/{cardNumber}",
  summary: "Publicly verify an alumni ID card by its card number (QR scan target)",
  tags: ["ID Card"],
  request: {
    params: z.object({ cardNumber: z.string() }),
  },
  responses: {
    200: { description: "Card details and validity" },
    404: { description: "Card not found", content: { "application/json": { schema: ErrorResponse } } },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "IPAM Alumni System API",
      version: "1.0.0",
      description:
        "REST API consumed by the Flutter mobile app (and any other external client). Admin-only operations are not exposed here — the admin panel is web-only.",
    },
    servers: [{ url: "/", description: "Current environment" }],
  });
}
