"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJobs } from "@/app/components/JobsProvider";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { jobs, loading, currentUser, refreshJobs } = useJobs();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const job = jobs.find((j) => j._id === id);

  if (!job) {
    router.push("/");
    return null;
  }

  const isOwner = currentUser?.role === "employer" && currentUser?.userId === job.postedBy;
  if (!isOwner) {
    router.push(`/jobs/${id}`);
    return null;
  }

  return (
    <EditForm
      id={id}
      defaults={{
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        description: job.description,
        contactEmail: job.contactEmail || "",
        contactPhone: job.contactPhone || "",
      }}
      refreshJobs={refreshJobs}
      router={router}
    />
  );
}

function EditForm({
  id,
  defaults,
  refreshJobs,
  router,
}: {
  id: string;
  defaults: Record<string, string>;
  refreshJobs: () => Promise<void>;
  router: ReturnType<typeof useRouter>;
}) {
  const [form, setForm] = useState<Record<string, string>>(defaults);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await refreshJobs();
      router.push(`/jobs/${id}`);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update job");
      setSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 focus:bg-white placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-violet-600 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to job
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-500 mt-1 text-sm">Update the details of this job listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 shadow-sm animate-fade-in">
        <div>
          <label htmlFor="title" className={labelClass}>Job Title</label>
          <input type="text" id="title" name="title" required value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g. Senior Frontend Developer" />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>Company</label>
          <input type="text" id="company" name="company" required value={form.company} onChange={handleChange} className={inputClass} placeholder="e.g. Acme Inc." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input type="text" id="location" name="location" required value={form.location} onChange={handleChange} className={inputClass} placeholder="e.g. New York, NY" />
          </div>
          <div>
            <label htmlFor="salary" className={labelClass}>Salary</label>
            <input type="text" id="salary" name="salary" required value={form.salary} onChange={handleChange} className={inputClass} placeholder="e.g. $80k - $120k" />
          </div>
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>Job Type</label>
          <select id="type" name="type" required value={form.type} onChange={handleChange} className={inputClass}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" name="description" required rows={6} value={form.description} onChange={handleChange} className={inputClass} placeholder="Describe the role, responsibilities, and requirements..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contactEmail" className={labelClass}>Contact Email</label>
            <input type="email" id="contactEmail" name="contactEmail" value={form.contactEmail} onChange={handleChange} className={inputClass} placeholder="hr@company.com" />
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClass}>Contact Phone</label>
            <input type="tel" id="contactPhone" name="contactPhone" value={form.contactPhone} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 shadow-sm shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
