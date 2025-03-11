import React from "react";
import JobList from "./JobListItem";
import prisma from "../lib/prisma";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// make interface to the props
interface IJobResultsProps {
  filterValues: JobFilterValues;
  page?: number;
}
async function JobResults({ filterValues, page = 1 }: IJobResultsProps) {
  // destrucutre filtervalues
  const { q, type, location, remote } = filterValues;
  // pagination111***
  const limit = 6;
  const skip = (page - 1) * limit;
  // =================================================================
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
  const jobsPromis = prisma.job.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
  });
  const countPromis = prisma.job.count({ where });
  // make a promis to appllay all above promises to execute parallel together
  const [jobs, totalCount] = await Promise.all([jobsPromis, countPromis]);
  // pagination222***
  const totalPages = Math.ceil(totalCount / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  return (
    <div className="space-y-4 grow">
      {/* grow => means take the whole width available */}
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobList job={job} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <div className="text-center text-3xl text-muted-foreground">
          No jobs found.
        </div>
      )}
      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

export default JobResults;
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      page: page.toString(),
    });

    return `/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible"
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible"
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
