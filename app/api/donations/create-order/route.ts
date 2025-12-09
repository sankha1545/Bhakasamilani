// app/api/donations/create-order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export const runtime = "nodejs"; // ensure Node runtime for Razorpay

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      amount: number;
      donorName: string;
      donorEmail: string;
      donorPhone: string;
    };

    const { amount, donorName, donorEmail, donorPhone } = body;

    // Basic validation
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!donorName || !donorEmail || !donorPhone) {
      return NextResponse.json(
        { error: "Missing donor details" },
        { status: 400 }
      );
    }

    // Sanitize / limits
    const normalizedAmount = Math.round(amount);
    if (normalizedAmount < 10 || normalizedAmount > 1000000) {
      // e.g. Rs 10 - Rs 10,00,000
      return NextResponse.json(
        { error: "Amount out of allowed range" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: normalizedAmount * 100, // in paise
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      payment_capture: 1,
      notes: {
        donorName,
        donorEmail,
        donorPhone,
      },
    });

    // Persist to DB as PENDING
    await prisma.donation.create({
      data: {
        orderId: order.id,
        amount: normalizedAmount,
        currency: order.currency,
        donorName,
        donorEmail,
        donorPhone,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
