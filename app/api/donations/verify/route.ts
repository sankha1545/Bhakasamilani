// app/api/donations/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      // optional extra fields coming from frontend – not required, but harmless
      donorName?: string;
      donorEmail?: string;
      donorPhone?: string;
      amount?: number;
    };

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment data" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.findUnique({
      where: { orderId: razorpay_order_id },
    });

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // Verify signature
    const shasum = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET as string
    );
    shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = shasum.digest("hex");

    const validSignature = digest === razorpay_signature;

    if (!validSignature) {
      // possible tampering – mark FAILED
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: "FAILED",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      });

      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 400 }
      );
    }

    // Mark as SUCCESS (same behaviour as before, but we keep the updated record)
    const updatedDonation = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: "SUCCESS",
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    });

    // Derive a human-readable receipt number from the donation id.
    // (No DB schema change needed – this is computed each time.)
    const receiptNo = `SRTK${String(updatedDonation.id).padStart(6, "0")}`;

    // Return extra data for the frontend receipt modal
    return NextResponse.json({
      success: true,
      payment: {
        paymentId: updatedDonation.paymentId,
        orderId: updatedDonation.orderId,
        amount: updatedDonation.amount,
        receiptNo,
        createdAt: updatedDonation.createdAt,
      },
      donor: {
        name: (updatedDonation as any).donorName ?? undefined,
        email: (updatedDonation as any).donorEmail ?? undefined,
        phone: (updatedDonation as any).donorPhone ?? undefined,
      },
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { error: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
