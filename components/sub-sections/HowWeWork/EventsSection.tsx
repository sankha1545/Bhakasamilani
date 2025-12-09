"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import RoyalDecree from "./RoyalDecree";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Upcoming Events
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
            Devotional{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
              Gatherings
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Satsangs, seva drives and community prayers — recorded here on our
            royal decrees for devotees.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-amber-200 px-4 py-2 text-xs text-slate-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-ping" />
              Loading events…
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-amber-100/70 bg-white/70 shadow-sm backdrop-blur-sm px-6 py-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No events scheduled at the moment
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Please check back soon for upcoming devotional gatherings and seva
              programs. 🙏
            </p>
          </div>
        ) : (
          // SIDE-BY-SIDE decrees (2 columns on md+, 1 column on mobile)
          <div className="grid gap-10 md:grid-cols-2">
            {events.map((event) => {
              const d = new Date(event.date);
              return (
                <RoyalDecree
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={format(d, "dd MMM yyyy")}
                  time={format(d, "HH:mm")}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
