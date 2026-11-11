
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import { studentTimetable } from "@/data/student-mock-data";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [today, setToday] = useState("");

  useEffect(() => {
    const weekday = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    setToday(weekday);

    if (DAYS.includes(weekday)) {
      setSelectedDay(weekday);
    }
  }, []);

  const sortedTimetable = useMemo(
    () =>
      [...studentTimetable].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      ),
    []
  );

  const dailyClasses = sortedTimetable.filter(
    (entry) => entry.day === selectedDay
  );

  const getDayCount = (day: string) =>
    sortedTimetable.filter((entry) => entry.day === day).length;

  const selectedDayIndex = DAYS.indexOf(selectedDay);

  const changeDay = (direction: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(DAYS.length - 1, selectedDayIndex + direction)
    );

    setSelectedDay(DAYS[nextIndex]);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / ACADEMICS / TIMETABLE
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Class Timetable
        </h1>

        <p className="mt-2 text-sm text-[var(--text-main)]/60">
          View your scheduled lectures, faculty, timings, and classrooms.
        </p>
      </section>

      {/* Weekly overview */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DAYS.map((day) => {
          const active = selectedDay === day;
          const isToday = today === day;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-xl border p-4 text-left transition-all ${
                active
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-semibold ${
                    active ? "text-[var(--primary)]" : ""
                  }`}
                >
                  {day.slice(0, 3)}
                </span>

                {isToday && (
                  <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[9px] font-semibold text-white dark:text-[#101B19]">
                    Today
                  </span>
                )}
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {getDayCount(day)}
              </p>

              <p className="mt-1 text-xs text-[var(--text-main)]/50">
                Scheduled classes
              </p>
            </button>
          );
        })}
      </section>

      {/* Selected day */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-color)] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays
                size={19}
                className="text-[var(--primary)]"
              />
              <h2 className="text-lg font-semibold">
                {selectedDay}
              </h2>

              {today === selectedDay && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2 py-1 text-[10px] font-semibold text-[var(--primary)]">
                  Today
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-[var(--text-main)]/50">
              {dailyClasses.length} classes scheduled
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeDay(-1)}
              disabled={selectedDayIndex === 0}
              aria-label="Previous day"
              className="rounded-lg border border-[var(--border-color)] p-2 transition-colors hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                if (DAYS.includes(today)) setSelectedDay(today);
              }}
              disabled={!DAYS.includes(today)}
              className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-medium hover:border-[var(--primary)] disabled:opacity-40"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => changeDay(1)}
              disabled={selectedDayIndex === DAYS.length - 1}
              aria-label="Next day"
              className="rounded-lg border border-[var(--border-color)] p-2 transition-colors hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {dailyClasses.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays
                size={34}
                className="mx-auto text-[var(--text-main)]/30"
              />

              <h3 className="mt-4 font-semibold">
                No classes scheduled
              </h3>

              <p className="mt-1 text-sm text-[var(--text-main)]/50">
                There are no lectures scheduled for {selectedDay}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyClasses.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative flex flex-col gap-4 rounded-xl border border-[var(--border-color)] p-4 transition-colors hover:border-[var(--primary)]/40 sm:flex-row sm:items-center sm:p-5"
                >
                  {/* Time */}
                  <div className="flex shrink-0 items-center gap-2 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                      <Clock3 size={16} />
                      {entry.startTime}
                    </div>

                    <p className="pl-6 text-xs text-[var(--text-main)]/50 sm:pl-6">
                      to {entry.endTime}
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="min-w-0 flex-1 border-l-2 border-[var(--primary)]/30 pl-4">
                    <p className="text-xs font-semibold tracking-wide text-[var(--primary)]">
                      {entry.subjectCode}
                    </p>

                    <h3 className="mt-1 font-semibold">
                      {entry.subjectName}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-main)]/55">
                      <span className="flex items-center gap-1.5">
                        <UserRound size={14} />
                        {entry.facultyName}
                      </span>

                      {entry.room && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {entry.room}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Class number */}
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-main)] text-xs font-semibold text-[var(--text-main)]/50 sm:flex">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Weekly schedule list */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Weekly Schedule
          </h2>

          <p className="mt-1 text-sm text-[var(--text-main)]/55">
            Overview of scheduled classes across the academic week.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="divide-y divide-[var(--border-color)]">
            {DAYS.map((day) => {
              const count = getDayCount(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--primary)]/5 ${
                    selectedDay === day ? "bg-[var(--primary)]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                      <BookOpen size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{day}</p>
                      {today === day && (
                        <p className="mt-0.5 text-[10px] text-[var(--primary)]">
                          Current day
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-[var(--text-main)]/55">
                    {count} {count === 1 ? "class" : "classes"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Read-only notice */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-4">
        <p className="text-sm font-medium">
          Timetable is read-only.
        </p>

        <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
          Class timings, subject allocations, faculty assignments, and room
          details are managed by the institution. Contact your department
          for timetable corrections.
        </p>
      </div>
    </div>
  );
}
