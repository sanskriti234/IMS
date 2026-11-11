
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  Users,
  CalendarDays,
  BookOpen,
  Search,
  Save,
  Send,
  RotateCcw,
  ScanFace,
  AlertCircle,
} from "lucide-react";

import {
  teachingOfferings,
  facultyStudents,
} from "@/data/faculty-mock-data";

type MarkStatus = "present" | "absent" | "unmarked";

export default function TeachingAttendancePage() {
  const [selectedOfferingId, setSelectedOfferingId] = useState(
    teachingOfferings[0]?.id ?? ""
  );

  const [attendance, setAttendance] = useState<Record<string, MarkStatus>>({});
  const [search, setSearch] = useState("");
const [sessionDate, setSessionDate] = useState("");

useEffect(() => {
  const currentDate = new Date();

  const localDate = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-");

  setSessionDate(localDate);
}, []);
  const [topic, setTopic] = useState("");
  const [sessionState, setSessionState] = useState<
    "not_saved" | "draft" | "submitted"
  >("not_saved");
  const [faceRecognitionStatus, setFaceRecognitionStatus] = useState<
    "idle" | "simulated"
  >("idle");

  const selectedOffering = teachingOfferings.find(
    (offering) => offering.id === selectedOfferingId
  );

  const assignedStudents = useMemo(() => {
    if (!selectedOffering) return [];

    return facultyStudents.filter(
      (student) =>
        student.batch === selectedOffering.batch &&
        student.section === selectedOffering.section &&
        student.semester === selectedOffering.semester &&
        student.status === "active"
    );
  }, [selectedOffering]);

  const filteredStudents = assignedStudents.filter((student) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.enrollmentNumber.toLowerCase().includes(query)
    );
  });

  const presentCount = assignedStudents.filter(
    (student) => attendance[student.id] === "present"
  ).length;

  const absentCount = assignedStudents.filter(
    (student) => attendance[student.id] === "absent"
  ).length;

  const unmarkedCount = assignedStudents.length - presentCount - absentCount;

  const allMarked = assignedStudents.length > 0 && unmarkedCount === 0;

  function markStudent(studentId: string, status: MarkStatus) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));

    setSessionState("not_saved");
  }

  function markAll(status: "present" | "absent") {
    const updated: Record<string, MarkStatus> = { ...attendance };

    assignedStudents.forEach((student) => {
      updated[student.id] = status;
    });

    setAttendance(updated);
    setSessionState("not_saved");
  }

  function resetAttendance() {
    setAttendance({});
    setSessionState("not_saved");
    setFaceRecognitionStatus("idle");
  }

  function saveDraft() {
    if (!selectedOffering || assignedStudents.length === 0) return;

    setSessionState("draft");
  }

  function submitAttendance() {
    if (!allMarked || !selectedOffering) return;

    setSessionState("submitted");
  }

  function simulateFaceRecognition() {
    // Frontend demonstration only. No camera or biometric processing.
    const updated: Record<string, MarkStatus> = { ...attendance };

    assignedStudents.forEach((student) => {
      if (!updated[student.id] || updated[student.id] === "unmarked") {
        updated[student.id] = "present";
      }
    });

    setAttendance(updated);
    setFaceRecognitionStatus("simulated");
    setSessionState("not_saved");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <section className="pb-7 border-b border-[var(--border-color)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#176B52] dark:text-[#81D3AD] mb-2">
          Teaching Workspace
        </p>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Attendance Management
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl">
          Conduct attendance for your assigned subjects. Review student
          records and submit the attendance session.
        </p>
      </section>

      {/* Session Configuration */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-bold">
            Create Attendance Session
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select the subject and enter the details for this class.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Assigned Subject
            </label>

            <select
              value={selectedOfferingId}
              onChange={(event) => {
                setSelectedOfferingId(event.target.value);
                setAttendance({});
                setSessionState("not_saved");
                setFaceRecognitionStatus("idle");
              }}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            >
              {teachingOfferings.map((offering) => (
                <option key={offering.id} value={offering.id}>
                  {offering.subjectCode} - {offering.subjectName} (
                  {offering.batch} / {offering.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Class Date
            </label>

            <input
              type="date"
              value={sessionDate}
              onChange={(event) => {
                setSessionDate(event.target.value);
                setSessionState("not_saved");
              }}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Class Topic
            </label>

            <input
              type="text"
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                setSessionState("not_saved");
              }}
              placeholder="Enter today's lecture topic"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Academic Group
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm">
              <GraduationGroupIcon />
              <span>
                {selectedOffering
                  ? `${selectedOffering.batch} · Section ${selectedOffering.section} · Semester ${selectedOffering.semester}`
                  : "No group assigned"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SummaryCard
          title="Present"
          value={presentCount}
          icon={CheckCircle2}
          color="green"
        />
        <SummaryCard
          title="Absent"
          value={absentCount}
          icon={AlertCircle}
          color="red"
        />
        <SummaryCard
          title="Not Marked"
          value={unmarkedCount}
          icon={Clock3}
          color="amber"
        />
      </section>

      {/* Face Recognition Placeholder */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#176B52] dark:text-[#81D3AD]">
              <ScanFace size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                Face Recognition Attendance
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Automated attendance interface preview
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 min-h-64 rounded-2xl bg-[#101B19] border border-[#233A34] flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-full border border-emerald-400/40 bg-emerald-400/10 flex items-center justify-center text-emerald-300">
              <Camera size={34} />
            </div>

            <h3 className="text-white font-semibold mt-5">
              Camera Preview Area
            </h3>

            <p className="text-sm text-slate-400 mt-2 max-w-sm">
              Camera integration and face detection will be connected in a
              future implementation.
            </p>

            <span className="mt-5 px-3 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold">
              Simulation Mode
            </span>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
            <div>
              <h3 className="font-semibold">Recognition Controls</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                The simulation marks currently unmarked students as present.
                It does not identify faces or access a camera.
              </p>
            </div>

            <button
              type="button"
              onClick={simulateFaceRecognition}
              disabled={assignedStudents.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#176B52] dark:bg-[#81D3AD] text-white dark:text-[#101B19] px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              <ScanFace size={18} />
              Run Attendance Simulation
            </button>

            {faceRecognitionStatus === "simulated" && (
              <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950 p-3 text-sm text-emerald-800 dark:text-emerald-300">
                Simulation completed. Review all attendance marks before
                saving or submitting.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Manual Attendance */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">
              Manual Attendance
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verify and update each student's attendance status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => markAll("present")}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:opacity-80"
            >
              Mark All Present
            </button>

            <button
              type="button"
              onClick={() => markAll("absent")}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 hover:opacity-80"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="relative max-w-md">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student name or enrollment..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm outline-none focus:border-[#176B52] dark:focus:border-[#81D3AD]"
              />
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No students found for this subject or search.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {filteredStudents.map((student) => {
                const status = attendance[student.id] ?? "unmarked";

                return (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-sm font-bold text-[#176B52] dark:text-[#81D3AD]">
                        {student.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-sm">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {student.enrollmentNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => markStudent(student.id, "present")}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          status === "present"
                            ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                            : "border-[var(--border-color)] hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        }`}
                      >
                        <CheckCircle2 size={15} />
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => markStudent(student.id, "absent")}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          status === "absent"
                            ? "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300"
                            : "border-[var(--border-color)] hover:bg-red-50 dark:hover:bg-red-950/50"
                        }`}
                      >
                        <Circle size={15} />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Submission Controls */}
      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-xl font-bold">
              Review and Submit
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {presentCount} present · {absentCount} absent · {unmarkedCount} not marked
            </p>

            {sessionState === "draft" && (
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                Draft saved in this page's local state.
              </p>
            )}

            {sessionState === "submitted" && (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">
                Attendance submitted in this frontend simulation.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetAttendance}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-[var(--bg-main)] transition"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={saveDraft}
              disabled={assignedStudents.length === 0}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-color)] text-sm font-semibold hover:bg-[var(--bg-main)] disabled:opacity-50 transition"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={submitAttendance}
              disabled={!allMarked || !topic.trim() || sessionState === "submitted"}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#176B52] dark:bg-[#81D3AD] text-white dark:text-[#101B19] text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Send size={16} />
              Submit Attendance
            </button>
          </div>
        </div>

        {(!allMarked || !topic.trim()) && (
          <p className="mt-4 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle size={15} />
            Mark every student and enter a class topic before submitting.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p>CoreSight · Faculty Workspace</p>
        <p>Academic Management System</p>
      </footer>
    </div>
  );
}

function GraduationGroupIcon() {
  return <BookOpen size={18} className="text-[#176B52] dark:text-[#81D3AD]" />;
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: typeof Users;
  color: "green" | "red" | "amber";
}) {
  const styles = {
    green: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    red: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
    amber: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2">{value}</h3>
        </div>

        <div className={`p-3 rounded-xl ${styles[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
