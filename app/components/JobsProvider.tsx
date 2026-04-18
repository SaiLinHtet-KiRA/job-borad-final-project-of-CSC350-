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
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextValue>({
  jobs: [],
  loading: true,
  currentUser: null,
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

  const refreshJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!initialized) {
    setInitialized(true);
    refreshJobs();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user || null));
  }

  return (
    <JobsContext.Provider value={{ jobs, loading, currentUser, refreshJobs }}>
      {children}
    </JobsContext.Provider>
  );
}
