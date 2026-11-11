
"use client";

import { useEffect, useMemo, useState, type FormEvent, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  assignedMentees,
  mentorshipRecords,
} from "@/data/faculty-mock-data";

export default function MentorshipRecordsPage() {
  const [records, setRecords] = useState(mentorshipRecords);
  const [search, setSearch] = useState("");
  const [selectedMentee, setSelectedMentee] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [today, setToday] = useState("");

  const [formData, setFormData] = useState({
    menteeId: "",
    date: "",
    discussionSummary: "",
    concern: "",
    recommendation: "",
    followUpDate: "",
  });

  // Initialize the current date after the component mounts.
  useEffect(() => {
    const currentDate = new Date();

    const localDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
    setFormData((previous) => ({
      ...previous,
      date: previous.date || localDate,
    }));
  }, []);

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => {
        const mentee = assignedMentees.find(
          (item) => item.id === record.menteeId
        );

        const matchesSearch =
          !search ||
          mentee?.name.toLowerCase().includes(search.toLowerCase()) ||
          record.discussionSummary.toLowerCase().includes(search.toLowerCase()) ||
          record.concern.toLowerCase().includes(search.toLowerCase());

        const matchesMentee =
          selectedMentee === "all" ||
          record.menteeId === selectedMentee;

        return matchesSearch && matchesMentee;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, search, selectedMentee]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.menteeId ||
      !formData.date ||
      !formData.discussionSummary.trim() ||
      !formData.concern.trim() ||
      !formData.recommendation.trim()
    ) {
      return;
    }

    const newRecord = {
      id: `record-${Date.now()}`,
      menteeId: formData.menteeId,
      date: formData.date,
      discussionSummary: formData.discussionSummary.trim(),
      concern: formData.concern.trim(),
      recommendation: formData.recommendation.trim(),
      ...(formData.followUpDate
        ? { followUpDate: formData.followUpDate }
        : {}),
    };

    setRecords((previous) => [newRecord, ...previous]);

    setFormData({
      menteeId: "",
      date: today,
      discussionSummary: "",
      concern: "",
      recommendation: "",
      followUpDate: "",
    });

    setShowForm(false);
  };

  const formatDate = (date: string) => {
    if (!date) return "Date unavailable";

    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 text-[var(--text-main)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
              Mentorship Records
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Maintain a record of student discussions, identified concerns,
              recommendations and follow-up dates.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125440] dark:bg-[#81D3AD] dark:text-[#10231C] dark:hover:bg-[#65BD95]"
          >
            <Plus size={18} />
            Add Mentorship Record
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Records"
            value={records.length}
            icon={ClipboardList}
          />

          <SummaryCard
            label="Mentees Covered"
            value={new Set(records.map((record) => record.menteeId)).size}
            icon={UserRound}
          />

          <SummaryCard
            label="Follow-ups Scheduled"
            value={records.filter((record) => record.followUpDate).length}
            icon={CalendarDays}
          />
        </div>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search mentee or discussion..."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#176B52] dark:focus:border-[#81D3AD]"
              />
            </div>

            <select
              value={selectedMentee}
              onChange={(event) => setSelectedMentee(event.target.value)}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            >
              <option value="all">All Mentees</option>
              {assignedMentees.map((mentee) => (
                <option key={mentee.id} value={mentee.id}>
                  {mentee.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              Record History
            </h2>

            <span className="text-sm text-slate-500">
              {filteredRecords.length} records
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-14 text-center">
              <ClipboardList
                size={32}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-3 font-semibold">No records found</h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or mentee filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const mentee = assignedMentees.find(
                  (item) => item.id === record.menteeId
                );

                return (
                  <article
                    key={record.id}
                    className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#176B52] dark:bg-emerald-950/40 dark:text-[#81D3AD]">
                          <UserRound size={20} />
                        </div>

                        <div>
                          <Link
                            href={`/faculty/mentor/mentees/${record.menteeId}`}
                            className="font-semibold transition hover:text-[#176B52] dark:hover:text-[#81D3AD]"
                          >
                            {mentee?.name ?? "Unknown Mentee"}
                          </Link>

                          <p className="mt-1 text-xs text-slate-500">
                            {mentee?.enrollmentNumber ?? "Enrollment unavailable"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={16} />
                        {formatDate(record.date)}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      <RecordDetail
                        title="Discussion Summary"
                        content={record.discussionSummary}
                      />

                      <RecordDetail
                        title="Identified Concern"
                        content={record.concern}
                      />

                      <RecordDetail
                        title="Recommendation"
                        content={record.recommendation}
                      />
                    </div>

                    {record.followUpDate && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border-color)] pt-4 text-sm">
                        <CalendarDays
                          size={16}
                          className="text-[#176B52] dark:text-[#81D3AD]"
                        />

                        <span className="text-slate-500">
                          Follow-up scheduled:
                        </span>

                        <span className="font-semibold">
                          {formatDate(record.followUpDate)}
                        </span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  New Mentorship Record
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Document the discussion and agreed actions.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-[var(--bg-main)]"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Mentee *
                </label>

                <select
                  required
                  value={formData.menteeId}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      menteeId: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
                >
                  <option value="">Choose a mentee</option>

                  {assignedMentees.map((mentee) => (
                    <option key={mentee.id} value={mentee.id}>
                      {mentee.name} — {mentee.enrollmentNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Discussion Date *
                  </label>

                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        date: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Follow-up Date
                  </label>

                  <input
                    type="date"
                    min={formData.date}
                    value={formData.followUpDate}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        followUpDate: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
                  />
                </div>
              </div>

              <TextAreaField
                label="Discussion Summary"
                required
                value={formData.discussionSummary}
                onChange={(value) =>
                  setFormData({ ...formData, discussionSummary: value })
                }
                placeholder="What was discussed during the meeting?"
              />

              <TextAreaField
                label="Identified Concern"
                required
                value={formData.concern}
                onChange={(value) =>
                  setFormData({ ...formData, concern: value })
                }
                placeholder="Mention academic, attendance or personal concerns..."
              />

              <TextAreaField
                label="Recommendation / Action Plan"
                required
                value={formData.recommendation}
                onChange={(value) =>
                  setFormData({ ...formData, recommendation: value })
                }
                placeholder="Record the recommended actions and expected next steps..."
              />

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-color)] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--bg-main)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125440] dark:bg-[#81D3AD] dark:text-[#10231C]"
                >
                  <CheckCircle2 size={17} />
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  icon: ElementType;
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

function RecordDetail({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--bg-main)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--text-main)]">
        {content}
      </p>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label} {required && "*"}
      </label>

      <textarea
        required={required}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#176B52] dark:focus:border-[#81D3AD]"
      />
    </div>
  );
}
