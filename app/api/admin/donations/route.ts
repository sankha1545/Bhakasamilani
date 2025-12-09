// app/api/admin/donations/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { PrismaClient, DonationStatus } from "@prisma/client";
import { getAdminFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");

  const where: any = {};

  // Here I assume amount is stored in paise; if it's rupees, remove "* 100"
  if (minAmount) {
    const v = Number(minAmount);
    if (!Number.isNaN(v)) {
      where.amount = { ...(where.amount || {}), gte: v * 100 };
    }
  }
  if (maxAmount) {
    const v = Number(maxAmount);
    if (!Number.isNaN(v)) {
      where.amount = { ...(where.amount || {}), lte: v * 100 };
    }
  }

  const donations = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Top donors by total successful amount
  const aggregates = await prisma.donation.groupBy({
    by: ["donorEmail", "donorName"],
    where: { status: DonationStatus.SUCCESS },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 5,
  });

  const topDonors = aggregates.map((row) => ({
    email: row.donorEmail,
    name: row.donorName,
    totalAmount: row._sum.amount || 0,
  }));

  return NextResponse.json({
    donations,
    topDonors,
  });
}
