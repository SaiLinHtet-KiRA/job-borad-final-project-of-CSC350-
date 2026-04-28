"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useJobs } from "./components/JobsProvider";

export default function HomePage() {
  const { jobs, loading, search, setSearch, page, setPage, totalPages, total, refreshJobs } = useJobs();
  const [input, setInput] = useState("");

  useEffect(() => {
    refreshJobs();
  }, [search, page, refreshJobs]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSearch(input);
    setPage(1);
  }

  function handleClear() {
    setInput("");
    setSearch("");
    setPage(1);
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-violet-100 max-w-2xl mx-auto leading-relaxed">
              Discover opportunities from top companies. Browse, apply, and take the next step in your career.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
                {total} {total === 1 ? "Job" : "Jobs"} Available
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search by title, company, location..."
                className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-400 border-0 shadow-lg shadow-black/10 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {input && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {search && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing results for <span className="font-semibold text-gray-700">&quot;{search}&quot;</span> — {total} {total === 1 ? "job" : "jobs"} found
            </p>
            <button
              onClick={handleClear}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {search ? "No jobs match your search" : "No jobs posted yet"}
            </p>
            <p className="text-gray-500 mt-1">
              {search ? "Try a different keyword" : "Be the first to post one!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {jobs.map((job, i) => (
                <Link
                  key={String(job._id)}
                  href={`/jobs/${job._id}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl flex items-center justify-center shrink-0 text-violet-600 font-bold text-lg border border-violet-100">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
                          {job.title}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5 text-gray-500 text-sm">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="truncate">{job.company}</span>
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-violet-100">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                        p === page
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
