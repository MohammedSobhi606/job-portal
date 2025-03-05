import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";

// interface for searchParams
interface IPageProps {
  // should be same as this spicial prop
  searchParams: {
    q?: string;
    location?: string;
    type?: string;
    remote?: string; // as any search parameters is string
  };
}
// metadata
function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
    ? `${type} developer jobs`
    : remote
    ? "Remote developer jobs"
    : "All developer jobs";

  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
  searchParams: { q, type, location, remote },
}: IPageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | portal jobs`,
  };
}
export default async function Home({
  searchParams: { q, location, type, remote },
}: IPageProps) {
  const filterValues: JobFilterValues = await {
    q,
    location,
    type,
    remote: remote === "true", // if remote is true then convert it to true
  }; // to transform remote to boolean
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Find your dream job.</p>
      </div>
      <section className="flex-col flex md:flex-row gap-4">
        {/* job filter sidebar */}
        <JobFilterSidebar defautlvalues={filterValues} />

        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
