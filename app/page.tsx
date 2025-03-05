import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { JobFilterValues } from "@/lib/validation";

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

export default async function Home({
  searchParams: { q, location, type, remote },
}: IPageProps) {
  const filterValues: JobFilterValues = {
    q,
    location,
    type,
    remote: remote === "true", // if remote is true then convert it to true
  }; // to transform remote to boolean
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>Developer jobs</H1>
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
