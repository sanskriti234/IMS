
"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Pencil,
  Save,
  X,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import { studentProfile } from "@/data/student-mock-data";

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [contactNumber, setContactNumber] = useState(
    studentProfile.contactNumber
  );
  const [address, setAddress] = useState(
    studentProfile.address ?? ""
  );

  const [draftContact, setDraftContact] = useState(contactNumber);
  const [draftAddress, setDraftAddress] = useState(address);

  const startEditing = () => {
    setDraftContact(contactNumber);
    setDraftAddress(address);
    setSaved(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftContact(contactNumber);
    setDraftAddress(address);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (draftContact.trim().length < 10) {
      return;
    }

    setContactNumber(draftContact.trim());
    setAddress(draftAddress.trim());
    setIsEditing(false);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <section>
        <p className="text-sm font-medium tracking-wide text-[var(--primary)]">
          STUDENT WORKSPACE / PROFILE
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-[var(--text-main)]/60">
          View your registered personal and academic information.
        </p>
      </section>

      {/* Profile identity */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="h-28 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--primary)]/10 to-transparent" />

        <div className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:px-7">
          <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--card-bg)] bg-[var(--primary)]/10 text-[var(--primary)]">
            <UserRound size={42} strokeWidth={1.5} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">
              {studentProfile.fullName}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-main)]/55">
              {studentProfile.enrollmentNumber}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {studentProfile.status}
              </span>

              <span className="rounded-full bg-[var(--bg-main)] px-3 py-1 text-xs text-[var(--text-main)]/60">
                Student
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-[#101B19]"
            >
              <Pencil size={16} />
              Edit Contact Details
            </button>
          )}
        </div>
      </section>

      {/* Save confirmation */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={18} />
          Contact details updated in this demo session.
        </div>
      )}

      {/* Personal information */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>
            <p className="mt-1 text-xs text-[var(--text-main)]/50">
              Contact details and registered identity.
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm hover:bg-[var(--bg-main)]"
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="button"
                onClick={saveChanges}
                disabled={draftContact.trim().length < 10}
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#101B19]"
              >
                <Save size={15} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ProfileField
            icon={<UserRound size={17} />}
            label="Full Name"
            value={studentProfile.fullName}
          />

          <ProfileField
            icon={<Mail size={17} />}
            label="Institutional Email"
            value={studentProfile.email}
          />

          <div>
            <FieldLabel
              icon={<Phone size={17} />}
              label="Contact Number"
            />

            {isEditing ? (
              <input
                type="tel"
                value={draftContact}
                onChange={(event) =>
                  setDraftContact(event.target.value)
                }
                maxLength={15}
                className="mt-2 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Enter contact number"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">
                {contactNumber || "Not provided"}
              </p>
            )}

            {isEditing && draftContact.trim().length < 10 && (
              <p className="mt-1 text-xs text-red-500">
                Enter a valid contact number with at least 10 characters.
              </p>
            )}
          </div>

          <div>
            <FieldLabel
              icon={<MapPin size={17} />}
              label="Address"
            />

            {isEditing ? (
              <textarea
                value={draftAddress}
                onChange={(event) =>
                  setDraftAddress(event.target.value)
                }
                rows={3}
                maxLength={300}
                className="mt-2 w-full resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]"
                placeholder="Enter your address"
              />
            ) : (
              <p className="mt-2 text-sm font-medium">
                {address || "Not provided"}
              </p>
            )}
          </div>

          <ProfileField
            icon={<UserRound size={17} />}
            label="Date of Birth"
            value={studentProfile.dateOfBirth || "Not provided"}
          />

          <ProfileField
            icon={<UserRound size={17} />}
            label="Gender"
            value={studentProfile.gender || "Not provided"}
          />
        </div>
      </section>

      {/* Academic information */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Academic Information
            </h2>
            <p className="mt-1 text-xs text-[var(--text-main)]/50">
              Official institutional records.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-main)] px-3 py-2 text-xs text-[var(--text-main)]/55">
            <LockKeyhole size={14} />
            Read only
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Department"
            value={`${studentProfile.academic.department} (${studentProfile.academic.departmentCode})`}
          />

          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Academic Session"
            value={studentProfile.academic.academicSession}
          />

          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Admission Year"
            value={String(studentProfile.academic.admissionYear)}
          />

          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Batch"
            value={studentProfile.academic.batch}
          />

          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Current Semester"
            value={`Semester ${studentProfile.academic.semester}`}
          />

          <ProfileField
            icon={<GraduationCap size={17} />}
            label="Section"
            value={studentProfile.academic.section}
          />

          <ProfileField
            icon={<UserRound size={17} />}
            label="Assigned Mentor"
            value={studentProfile.academic.assignedMentor}
          />
        </div>
      </section>

      {/* Account permissions */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:flex-row sm:items-start sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            Profile access and permissions
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/55">
            Students can update permitted contact information. Enrollment
            number, department, academic session, batch, semester, section,
            and mentor assignment are maintained through authorized
            institutional processes and cannot be changed here.
          </p>
        </div>
      </section>
    </div>
  );
}

function FieldLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-main)]/50">
      <span className="text-[var(--primary)]">{icon}</span>
      {label}
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel icon={icon} label={label} />
      <p className="mt-2 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  );
}
