
"use client";

import { useState } from "react";
import {
  ScanFace,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock3,
  RefreshCw,
  Info,
  LockKeyhole,
} from "lucide-react";

import {
  studentFaceEnrollment,
} from "@/data/student-mock-data";

import type { FaceEnrollmentStatus } from "@/types/student";

export default function StudentFaceEnrollmentPage() {
  const [status, setStatus] = useState<FaceEnrollmentStatus>(
    studentFaceEnrollment.status
  );

  const [lastUpdated, setLastUpdated] = useState(
    studentFaceEnrollment.lastUpdated ?? ""
  );

  const [showConfirmation, setShowConfirmation] = useState(false);

  const statusConfig: Record<
    FaceEnrollmentStatus,
    {
      label: string;
      description: string;
      icon: typeof Info;
      color: string;
    }
  > = {
    not_enrolled: {
      label: "Not Enrolled",
      description: "Your face enrollment has not been completed.",
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-400",
    },
    pending: {
      label: "Pending",
      description: "Your enrollment is awaiting verification.",
      icon: Clock3,
      color: "text-amber-600 dark:text-amber-400",
    },
    enrolled: {
      label: "Enrolled",
      description: "Your enrollment is marked as complete in this demo.",
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    failed: {
      label: "Failed",
      description: "The enrollment process was not completed successfully.",
      icon: AlertCircle,
      color: "text-red-500",
    },
    re_enrollment_required: {
      label: "Re-enrollment Required",
      description: "A new enrollment is required.",
      icon: RefreshCw,
      color: "text-amber-600 dark:text-amber-400",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const completeDemoEnrollment = () => {
    setStatus("enrolled");
    setLastUpdated(
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    setShowConfirmation(false);
  };

  const resetDemoEnrollment = () => {
    setStatus("not_enrolled");
    setLastUpdated("");
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / FACE ENROLLMENT
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Face Enrollment
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-main)]/60">
          Manage your face enrollment status for the institution's
          attendance identification process.
        </p>
      </section>

      {/* Status card */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <ScanFace size={25} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-main)]/50">
                Current Enrollment Status
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusIcon size={18} className={currentStatus.color} />

                <h2 className={`text-xl font-semibold ${currentStatus.color}`}>
                  {currentStatus.label}
                </h2>
              </div>

              <p className="mt-2 text-sm text-[var(--text-main)]/55">
                {currentStatus.description}
              </p>
            </div>
          </div>

          {lastUpdated && (
            <div className="rounded-xl bg-[var(--bg-main)] px-4 py-3">
              <p className="text-xs text-[var(--text-main)]/50">
                Last Updated
              </p>
              <p className="mt-1 text-sm font-medium">
                {lastUpdated}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Demo notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <Info
          size={19}
          className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
        />

        <div>
          <p className="text-sm font-semibold">
            Frontend demonstration only
          </p>

          <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/60">
            This page does not access your camera, capture images, create
            biometric templates, or communicate with a recognition service.
            Completing the demo only changes local page state.
          </p>
        </div>
      </div>

      {/* Enrollment workspace */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Camera placeholder */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Enrollment Preview</h2>
              <p className="mt-1 text-xs text-[var(--text-main)]/50">
                Camera preview placeholder
              </p>
            </div>

            <span className="rounded-full bg-[var(--bg-main)] px-3 py-1 text-xs text-[var(--text-main)]/50">
              Demo
            </span>
          </div>

          <div className="relative mt-5 flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-main)] p-6 text-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-dashed border-[var(--primary)]/50">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                <ScanFace size={58} strokeWidth={1.3} />
              </div>
            </div>

            <h3 className="mt-6 font-semibold">
              Camera preview unavailable
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-main)]/50">
              A live camera preview will be available when the actual
              enrollment service is integrated.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-main)]/40">
              <Camera size={15} />
              No camera access requested
            </div>
          </div>

          <div className="mt-5">
            {status === "enrolled" ? (
              <button
                type="button"
                onClick={resetDemoEnrollment}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <RefreshCw size={17} />
                Reset Demo Enrollment
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmation(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-[#101B19]"
              >
                <ScanFace size={18} />
                Complete Demo Enrollment
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6 lg:col-span-2">
          <h2 className="font-semibold">Enrollment Instructions</h2>

          <p className="mt-1 text-xs text-[var(--text-main)]/50">
            Requirements for the actual enrollment process.
          </p>

          <div className="mt-6 space-y-5">
            <Instruction
              number="01"
              title="Camera readiness"
              description="Use a functioning camera in a well-lit environment."
            />

            <Instruction
              number="02"
              title="Face visibility"
              description="Keep your face clearly visible without obstructions."
            />

            <Instruction
              number="03"
              title="Neutral positioning"
              description="Look directly towards the camera during capture."
            />

            <Instruction
              number="04"
              title="Enrollment verification"
              description="Wait for the institution's enrollment service to verify your submission."
            />
          </div>

          <div className="mt-7 rounded-xl bg-[var(--bg-main)] p-4">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={17}
                className="text-[var(--primary)]"
              />
              <p className="text-sm font-semibold">
                Biometric data protection
              </p>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[var(--text-main)]/55">
              Actual biometric collection and processing must follow
              institutional authorization, access control, and applicable
              data-protection requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Confirmation dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enrollment-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <ShieldCheck size={25} />
            </div>

            <h2
              id="enrollment-confirmation-title"
              className="mt-4 text-lg font-semibold"
            >
              Complete demo enrollment?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/60">
              This will mark your enrollment as complete in the current
              browser page state. No image will be captured or submitted.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-lg border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--bg-main)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={completeDemoEnrollment}
                className="flex-1 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:text-[#101B19]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Important information */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-4">
        <p className="text-sm font-medium">
          Enrollment status is institution-controlled.
        </p>

        <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
          In the production system, enrollment verification and biometric
          records must be managed by the authorized institutional service.
          Students cannot manually change their official enrollment status.
        </p>
      </div>
    </div>
  );
}

function Instruction({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>

        <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
          {description}
        </p>
      </div>
    </div>
  );
}
