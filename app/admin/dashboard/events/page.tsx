"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string from API
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("18:00"); // default 24hr format

  // fetch upcoming events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // simple month calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const days: Date[] = [];

    // blank days before 1st of month (so Monday–Sunday grid)
    const startWeekday = (start.getDay() + 6) % 7; // make Monday=0
    for (let i = 0; i < startWeekday; i++) {
      days.push(new Date(NaN)); // empty slot
    }

    for (let d = 1; d <= end.getDate(); d++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }

    return days;
  }, [currentMonth]);

  const openModalForDate = (date: Date) => {
    setSelectedDate(date);
    setTitle("");
    setDescription("");
    setTime("18:00");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    try {
      setCreating(true);
      setError(null);

      const [hoursStr, minutesStr] = time.split(":");
      const eventDate = new Date(selectedDate);
      eventDate.setHours(Number(hoursStr), Number(minutesStr), 0, 0);

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dateTime: eventDate.toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create event");
      }

      closeModal();
      await fetchEvents();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Event Calendar
            </h1>
            <p className="text-sm text-slate-500">
              Click on a date to create an event. Only upcoming events will be
              visible to donors.
            </p>
          </div>
          <div className="rounded-full bg-orange-50 px-4 py-2 text-xs font-medium text-orange-700">
            Bhakta Sammilan ✨
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar card */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={goToPrevMonth}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              >
                ◀
              </button>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-500">
                  {format(currentMonth, "yyyy")}
                </div>
                <div className="text-lg font-semibold text-slate-800">
                  {format(currentMonth, "MMMM")}
                </div>
              </div>
              <button
                onClick={goToNextMonth}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
              {calendarDays.map((day, idx) => {
                if (isNaN(day.getTime())) {
                  // empty cell
                  return <div key={idx} className="h-10 rounded-lg" />;
                }

                const isToday = (() => {
                  const now = new Date();
                  return (
                    now.getFullYear() === day.getFullYear() &&
                    now.getMonth() === day.getMonth() &&
                    now.getDate() === day.getDate()
                  );
                })();

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openModalForDate(day)}
                    className={`flex h-10 items-center justify-center rounded-lg border text-sm transition ${
                      isToday
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-slate-100 bg-slate-50 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Tip: Choose date → fill title, description & time (24-hour) →
              save. Donors will see it as an upcoming event.
            </p>
          </div>

          {/* Upcoming events list */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-800">
              Upcoming Events
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">Loading events…</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-slate-500">
                No upcoming events created yet.
              </p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <div
                      key={event.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">
                            {event.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {event.description}
                          </p>
                        </div>
                        <div className="rounded-lg bg-orange-50 px-2 py-1 text-right text-[11px] font-medium text-orange-700">
                          <div>{format(eventDate, "dd MMM")}</div>
                          <div>{format(eventDate, "HH:mm")} hrs</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-3 text-[11px] text-slate-400">
              Once the date and time of an event is over, it will no longer
              appear here or on the donor site.
            </p>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Create Event
                </h2>
                <p className="text-xs text-slate-500">
                  {format(selectedDate, "EEEE, dd MMM yyyy")}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                  placeholder="Evening satsang, kirtan, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                  placeholder="Short details about the event for donors."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Time (24-hour format)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="mt-2 w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating ? "Saving…" : "Save Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
