"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  MouseEvent,
} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, Activity, BarChart3 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type DonationStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

type Donation = {
  id: string;
  orderId: string;
  paymentId: string | null;
  signature: string | null;
  amount: number; // RUPEES
  currency: string;

  donorName: string;
  donorEmail: string;
  donorPhone: string;

  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
};

type Timeframe = "daily" | "monthly" | "yearly";

type ChartPoint = {
  label: string;
  key: string;
  totalAmount: number;
  count: number;
};

const formatAmount = (amount: number) =>
  `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function AnalyticsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");

  const chartRef = useRef<HTMLDivElement | null>(null);

  // Fetch all donations once
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/donations", {
          credentials: "include",
        });

        if (res.status === 401) {
          // Let your auth layout handle redirect; here just stop
          setError("Not authorized.");
          setDonations([]);
          return;
        }

        const data = await res.json();
        setDonations(data.donations || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load donation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Only successful Razorpay donations
  const completedDonations = useMemo(
    () =>
      donations.filter(
        (d) =>
          d.status === "SUCCESS" &&
          d.paymentId &&
          d.paymentId.trim() !== ""
      ),
    [donations]
  );

  // Aggregate donations by day/month/year for the chart
  const chartData = useMemo<ChartPoint[]>(() => {
    const map = new Map<string, ChartPoint>();

    for (const d of completedDonations) {
      const date = new Date(d.createdAt);

      let key: string;
      let label: string;

      if (timeframe === "daily") {
        // YYYY-MM-DD
        key = date.toISOString().slice(0, 10);
        label = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
      } else if (timeframe === "monthly") {
        // YYYY-MM
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        key = `${y}-${m}`;
        label = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });
      } else {
        // yearly
        const y = date.getFullYear();
        key = String(y);
        label = String(y);
      }

      const existing = map.get(key);
      if (existing) {
        existing.totalAmount += d.amount;
        existing.count += 1;
      } else {
        map.set(key, {
          key,
          label,
          totalAmount: d.amount,
          count: 1,
        });
      }
    }

    // Sort by key (chronological)
    const arr = Array.from(map.values()).sort((a, b) =>
      a.key.localeCompare(b.key)
    );

    return arr;
  }, [completedDonations, timeframe]);

  const totalAmount = useMemo(
    () => completedDonations.reduce((sum, d) => sum + d.amount, 0),
    [completedDonations]
  );

  const totalCount = completedDonations.length;

  const averagePerPoint = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((s, p) => s + p.totalAmount, 0);
    return sum / chartData.length;
  }, [chartData]);

  const handleExportPdf = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(14);
      pdf.text("Donation Analytics", margin, 12);
      pdf.setFontSize(11);
      pdf.text(
        `View: ${timeframe.toUpperCase()} | Generated on ${new Date().toLocaleString(
          "en-IN"
        )}`,
        margin,
        18
      );

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        24,
        imgWidth,
        Math.min(imgHeight, pageHeight - 30)
      );
      pdf.save(`donation-analytics-${timeframe}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const isEmpty = !loading && chartData.length === 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 mb-1">
            <Activity className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-sky-700">
              Analytics
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Donation Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Visualize completed Razorpay donations over time. Switch between
            daily, monthly, and yearly views or export the chart as a PDF.
          </p>
        </div>

        <button
          onClick={handleExportPdf}
          disabled={loading || chartData.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 transition"
        >
          <Download className="h-4 w-4" />
          Export as PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Total Donations
            </p>
            <p className="mt-1 text-lg font-semibold">
              {totalCount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 p-2">
            <BarChart3 className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Total Amount
            </p>
            <p className="mt-1 text-lg font-semibold text-emerald-700">
              {formatAmount(totalAmount)}
            </p>
          </div>
          <div className="rounded-full border border-emerald-100 bg-emerald-50 p-2">
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Average per {timeframe === "daily" ? "day" : timeframe === "monthly" ? "month" : "year"}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {formatAmount(averagePerPoint || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe selector + chart */}
      <div
        ref={chartRef}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
                <Activity className="h-3.5 w-3.5 text-slate-500" />
              </span>
              Donation Trend
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Line graph showing total donation amount for each period.
            </p>
          </div>

          {/* Timeframe pill selector */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
            {(["daily", "monthly", "yearly"] as Timeframe[]).map((t) => {
              const label =
                t === "daily" ? "Daily" : t === "monthly" ? "Monthly" : "Yearly";
              const active = timeframe === t;

              return (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`rounded-full px-3 py-1.5 transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart area */}
        <div className="h-72 w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping mr-2" />
              Loading analytics…
            </div>
          ) : isEmpty ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              No completed donations found to plot the graph yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="label"
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1000
                      ? `₹${(v / 1000).toFixed(0)}k`
                      : `₹${v.toFixed(0)}`
                  }
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: any, name) => {
                    if (name === "totalAmount") return [formatAmount(value), "Total"];
                    if (name === "count") return [value, "Donations"];
                    return [value, name];
                  }}
                  labelFormatter={(label: any) => `${label}`}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  name="Total amount"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={600}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
