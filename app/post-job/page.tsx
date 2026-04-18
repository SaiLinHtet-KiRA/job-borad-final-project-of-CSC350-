"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role === "employer") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      });
  }, []);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="text-center bg-white rounded-2xl p-10 border border-gray-100 shadow-sm max-w-sm w-full animate-fade-in">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-5 text-sm">Only employers can post jobs.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:from-violet-700 hover:to-indigo-700 transition-all"
          >
            Login as Employer
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      type: formData.get("type"),
      description: formData.get("description"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to create job");
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 focus:bg-white placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-violet-600 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
        <p className="text-gray-500 mt-1 text-sm">Fill in the details below to list a new position.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 shadow-sm animate-fade-in">
        <div>
          <label htmlFor="title" className={labelClass}>Job Title</label>
          <input type="text" id="title" name="title" required className={inputClass} placeholder="e.g. Senior Frontend Developer" />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>Company</label>
          <input type="text" id="company" name="company" required className={inputClass} placeholder="e.g. Acme Inc." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input type="text" id="location" name="location" required className={inputClass} placeholder="e.g. New York, NY" />
          </div>
          <div>
            <label htmlFor="salary" className={labelClass}>Salary</label>
            <input type="text" id="salary" name="salary" required className={inputClass} placeholder="e.g. $80k - $120k" />
          </div>
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>Job Type</label>
          <select id="type" name="type" required className={inputClass}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" name="description" required rows={6} className={inputClass} placeholder="Describe the role, responsibilities, and requirements..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contactEmail" className={labelClass}>Contact Email</label>
            <input type="email" id="contactEmail" name="contactEmail" className={inputClass} placeholder="hr@company.com" />
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClass}>Contact Phone</label>
            <input type="tel" id="contactPhone" name="contactPhone" className={inputClass} placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-indigo-700 shadow-sm shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
