import React from "react";
import JobList from "./JobListItem";
import prisma from "../lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";

// make interface to the props
interface IJobResultsProps {
  filterValues: JobFilterValues;
}
async function JobResults({
  filterValues: { q, type, location, remote },
}: IJobResultsProps) {
  // add search with text search functionality
  // convert string search to valid postgresql search text [cat & dog]
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");
  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { location: { search: searchString } },
          { type: { search: searchString } },
          { companyName: { search: searchString } },
          { locationType: { search: searchString } },
        ],
      }
    : {};
  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      { type: type },
      { location: location },
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };
  const jobs = await prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="space-y-4 grow">
      {/* grow => means take the whole width available */}
      {jobs.map((job) => (
        <JobList job={job} key={job.id} />
      ))}
      {jobs.length === 0 && (
        <div className="text-center text-3xl text-muted-foreground">
          No jobs found.
        </div>
      )}
    </div>
  );
}

export default JobResults;
