import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events  → list only upcoming events
export async function GET() {
  try {
    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: now,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[GET_EVENTS]", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, dateTime } = body as {
      title?: string;
      description?: string;
      dateTime?: string;
    };

    if (!title || !description || !dateTime) {
      return NextResponse.json(
        { error: "Missing title, description or dateTime" },
        { status: 400 }
      );
    }

    const eventDate = new Date(dateTime);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid dateTime" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: eventDate,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("[CREATE_EVENT]", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
