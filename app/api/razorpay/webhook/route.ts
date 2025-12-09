// app/api/razorpay/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text(); // important for signature
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      console.warn("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    const eventType = event.event as string;

    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;

      const orderId = payment.order_id as string | undefined;
      const paymentId = payment.id as string;

      if (orderId) {
        await prisma.donation.updateMany({
          where: { orderId },
          data: {
            status: "SUCCESS",
            paymentId,
          },
        });
      }
    }

    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id as string | undefined;
      const paymentId = payment.id as string;

      if (orderId) {
        await prisma.donation.updateMany({
          where: { orderId },
          data: {
            status: "FAILED",
            paymentId,
          },
        });
      }

      // Optional: auto-initiate refund here if payment was captured
      // using Razorpay Payments API. Very often, for failed payments,
      // amount is not captured and bank auto-reverses.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
