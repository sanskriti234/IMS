
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ListChecks,
  Search,
  UserRound,
} from "lucide-react";
import {
  assignedMentees,
  mentorshipFollowUps,
} from "@/data/faculty-mock-data";
import type { FollowUpStatus } from "@/types/faculty";

type FollowUp = (typeof mentorshipFollowUps)[number];

type FilterStatus = "all" | FollowUpStatus;

export default function MentorFollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(mentorshipFollowUps);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

const [today, setToday] = useState<string>("");

useEffect(() => {
  const currentDate = new Date();
  const localDate = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-");

  setToday(localDate);
}, []);

const getEffectiveStatus = (followUp: FollowUp): FollowUpStatus => {
  if (followUp.status === "completed") return "completed";

  // Avoid date comparison until the client date is initialized.
  if (!today) return followUp.status;

  if (followUp.dueDate < today) return "overdue";

  return "pending";
};

  const filteredFollowUps = useMemo(() => {
    return followUps
      .filter((followUp) => {
        const mentee = assignedMentees.find(
          (item) => item.id === followUp.menteeId
        );

        const effectiveStatus = getEffectiveStatus(followUp);

        const matchesSearch =
          !search ||
          followUp.title.toLowerCase().includes(search.toLowerCase()) ||
          mentee?.name.toLowerCase().includes(search.toLowerCase()) ||
          mentee?.enrollmentNumber.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || effectiveStatus === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [followUps, search, statusFilter, today]);

  const counts = {
    total: followUps.length,
    pending: followUps.filter(
      (item) => getEffectiveStatus(item) === "pending"
    ).length,
    overdue: followUps.filter(
      (item) => getEffectiveStatus(item) === "overdue"
    ).length,
    completed: followUps.filter(
      (item) => getEffectiveStatus(item) === "completed"
    ).length,
  };

  const updateStatus = (
    id: string,
    status: FollowUpStatus
  ) => {
    setFollowUps((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 text-[var(--text-main)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div>
          <Link
            href="/faculty/mentor/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
          >
            <ArrowLeft size={16} />
            Mentor Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B52] dark:text-[#81D3AD]">
            Mentor Workspace
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Follow-up Tracker
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Monitor agreed actions, follow-up deadlines and pending student
            interventions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Follow-ups"
            value={counts.total}
            icon={ListChecks}
          />
          <SummaryCard
            label="Pending"
            value={counts.pending}
            icon={Clock3}
          />
          <SummaryCard
            label="Overdue"
            value={counts.overdue}
            icon={CircleAlert}
          />
          <SummaryCard
            label="Completed"
            value={counts.completed}
            icon={CheckCircle2}
          />
        </div>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search task, mentee or enrollment number..."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#176B52] dark:focus:border-[#81D3AD]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as FilterStatus)
              }
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Follow-up Tasks
            </h2>
            <span className="text-sm text-slate-500">
              {filteredFollowUps.length} tasks
            </span>
          </div>

          {filteredFollowUps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-14 text-center">
              <ListChecks
                size={34}
                className="mx-auto text-slate-400"
              />
              <h3 className="mt-3 font-semibold">No follow-ups found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or status filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFollowUps.map((followUp) => {
                const mentee = assignedMentees.find(
                  (item) => item.id === followUp.menteeId
                );

                const status = getEffectiveStatus(followUp);

                return (
                  <article
                    key={followUp.id}
                    className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 transition hover:border-[#176B52]/40 dark:hover:border-[#81D3AD]/40"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{followUp.title}</h3>
                          <StatusBadge status={status} />
                        </div>

                        <Link
                          href={`/faculty/mentor/mentees/${followUp.menteeId}`}
                          className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
                        >
                          <UserRound size={15} />
                          {mentee?.name ?? "Unknown Mentee"}
                          {mentee?.enrollmentNumber
                            ? ` · ${mentee.enrollmentNumber}`
                            : ""}
                        </Link>

                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays size={16} />
                          <span>Due: {formatDate(followUp.dueDate)}</span>
                          {status === "overdue" && (
                            <span className="font-medium text-red-600 dark:text-red-400">
                              · Deadline passed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {status !== "completed" ? (
                          <button
                            onClick={() =>
                              updateStatus(followUp.id, "completed")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125440] dark:bg-[#81D3AD] dark:text-[#10231C]"
                          >
                            <CheckCircle2 size={16} />
                            Mark Completed
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateStatus(followUp.id, "pending")
                            }
                            className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--bg-main)]"
                          >
                            Reopen Task
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
              <CircleAlert size={19} />
            </div>
            <div>
              <h3 className="font-semibold">Follow-up management</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Overdue status is calculated from the due date. Completing a
                task updates its status in this page&apos;s local state.
                Reopening a completed task returns it to pending or overdue,
                depending on its due date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="rounded-xl bg-emerald-50 p-2 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: FollowUpStatus }) {
  const styles: Record<FollowUpStatus, string> = {
    pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    overdue:
      "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
