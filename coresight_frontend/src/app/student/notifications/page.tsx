
"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  Building2,
  Clock3,
  Inbox,
  Filter,
  BookOpen,
} from "lucide-react";

import { studentNotifications } from "@/data/student-mock-data";
import type {
  StudentNotification,
  StudentNotificationCategory,
} from "@/types/student";

type NotificationFilter =
  | "all"
  | "unread"
  | StudentNotificationCategory;

const categoryConfig: Record<
  StudentNotificationCategory,
  {
    label: string;
    icon: typeof Bell;
  }
> = {
  academic: {
    label: "Academic",
    icon: GraduationCap,
  },
  attendance: {
    label: "Attendance",
    icon: ClipboardList,
  },
  registration: {
    label: "Registration",
    icon: BookOpen,
  },
  department: {
    label: "Department",
    icon: Building2,
  },
  timetable: {
    label: "Timetable",
    icon: CalendarDays,
  },
};

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] =
    useState<StudentNotification[]>(studentNotifications);

  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeFilter === "unread") {
        return !notification.isRead;
      }

      if (activeFilter === "all") {
        return true;
      }

      return notification.category === activeFilter;
    });
  }, [notifications, activeFilter]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const filterOptions: {
    value: NotificationFilter;
    label: string;
  }[] = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "academic", label: "Academic" },
    { value: "attendance", label: "Attendance" },
    { value: "registration", label: "Registration" },
    { value: "department", label: "Department" },
    { value: "timetable", label: "Timetable" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
            STUDENT WORKSPACE / NOTIFICATIONS
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-[var(--text-main)]/60">
            Academic updates and important institutional announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        )}
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Notifications"
          value={notifications.length}
          icon={<Bell size={20} />}
        />

        <SummaryCard
          label="Unread"
          value={unreadCount}
          icon={<Inbox size={20} />}
          highlight={unreadCount > 0}
        />

        <SummaryCard
          label="Read"
          value={notifications.length - unreadCount}
          icon={<CheckCheck size={20} />}
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-[var(--primary)]" />
          <h2 className="text-sm font-semibold">Filter Notifications</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-white dark:text-[#101B19]"
                    : "bg-[var(--bg-main)] text-[var(--text-main)]/65 hover:text-[var(--primary)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Notification list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {activeFilter === "all"
              ? "All Notifications"
              : activeFilter === "unread"
                ? "Unread Notifications"
                : `${categoryConfig[activeFilter].label} Notifications`}
          </h2>

          <span className="text-xs text-[var(--text-main)]/50">
            {filteredNotifications.length}{" "}
            {filteredNotifications.length === 1
              ? "notification"
              : "notifications"}
          </span>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-main)] text-[var(--text-main)]/40">
              <Inbox size={27} />
            </div>

            <h3 className="mt-4 font-semibold">
              No notifications found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[var(--text-main)]/50">
              There are no notifications matching the selected filter.
            </p>

            {activeFilter !== "all" && (
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </section>

      {/* Information */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
        <Clock3
          size={18}
          className="mt-0.5 shrink-0 text-[var(--primary)]"
        />

        <p className="text-xs leading-relaxed text-[var(--text-main)]/55">
          Notifications displayed here are mock demonstration records.
          In the production system, notifications will be generated from
          authorized academic, attendance, registration, and timetable
          workflows.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--text-main)]/55">
          {label}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            highlight
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-[var(--primary)]/10 text-[var(--primary)]"
          }`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: StudentNotification;
  onMarkRead: (id: string) => void;
}) {
  const config = categoryConfig[notification.category];
  const CategoryIcon = config.icon;

  const formattedDate = new Date(
    `${notification.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className={`rounded-2xl border bg-[var(--card-bg)] p-4 transition-colors sm:p-5 ${
        notification.isRead
          ? "border-[var(--border-color)]"
          : "border-[var(--primary)]/35 bg-[var(--primary)]/[0.025]"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <CategoryIcon size={20} />

          {!notification.isRead && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--card-bg)] bg-[var(--primary)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--primary)]">
              {config.label}
            </span>

            {!notification.isRead && (
              <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                NEW
              </span>
            )}
          </div>

          <h3 className="mt-2 text-sm font-semibold">
            {notification.title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-[var(--text-main)]/60">
            {notification.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-main)]/45">
              <Clock3 size={13} />
              {formattedDate}
            </span>

            {!notification.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                <Check size={14} />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
