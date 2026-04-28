"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface JobData {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  type: string;
  contactEmail?: string;
  contactPhone?: string;
  postedBy: string;
}

interface UserData {
  userId: string;
  email: string;
  role: "employer" | "employee";
  name: string;
}

interface JobsContextValue {
  jobs: JobData[];
  loading: boolean;
  currentUser: UserData | null;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  total: number;
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextValue>({
  jobs: [],
  loading: true,
  currentUser: null,
  search: "",
  setSearch: () => {},
  page: 1,
  setPage: () => {},
  totalPages: 1,
  total: 0,
  refreshJobs: async () => {},
});

export function useJobs() {
  return useContext(JobsContext);
}

export default function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const refreshJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "6");
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setJobs([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  if (!initialized) {
    setInitialized(true);
    refreshJobs();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user || null));
  }

  return (
    <JobsContext.Provider
      value={{
        jobs,
        loading,
        currentUser,
        search,
        setSearch,
        page,
        setPage,
        totalPages,
        total,
        refreshJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
