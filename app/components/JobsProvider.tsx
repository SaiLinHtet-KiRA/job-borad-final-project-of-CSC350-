"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
}

interface JobsContextValue {
  jobs: JobData[];
  loading: boolean;
}

const JobsContext = createContext<JobsContextValue>({ jobs: [], loading: true });

export function useJobs() {
  return useContext(JobsContext);
}

export default function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <JobsContext.Provider value={{ jobs, loading }}>
      {children}
    </JobsContext.Provider>
  );
}
