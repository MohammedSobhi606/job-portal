import { Search } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/jobTypes";
import { Button } from "./ui/button";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

async function filterJobs(formdata: FormData) {
  "use server";
  const values = Object.fromEntries(formdata.entries()); // transform to key value pairs
  // validate inputs with zod
  const { location, q, remote, type } = jobFilterSchema.parse(values);
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}
// get default values of search parameters
interface JobFilterSidebarProps {
  defautlvalues: JobFilterValues;
}
async function JobFilterSidebar({
  defautlvalues: { location, q, remote, type },
}: JobFilterSidebarProps) {
  // fetch jobsLocations from database
  const jobsLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: "location",
    })
    .then((jobsLocations) =>
      jobsLocations.map(({ location }) => location).filter(Boolean)
    )) as String[];

  return (
    <aside className="sticky top-0 md:top-20 h-fit rounded-lg border bg-background p-4 md:w-[260px] md:sticky">
      <form action={filterJobs}>
        <div className="space-y-4">
          <Label htmlFor="q" className="flex justify-between w-full">
            Search
            <Search />
          </Label>
          <Input
            id="q"
            name="q"
            placeholder="Title ,company,etc.. "
            defaultValue={q}
          />
          {/* types */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={type}>
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          {/* locations options */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue={location}>
              <option value="">All locations</option>
              {jobsLocations.length > 0 &&
                jobsLocations.map((location, inx) => (
                  <option key={inx} value={location as string}>
                    {location}
                  </option>
                ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>{" "}
        </div>
      </form>
    </aside>
  );
}

export default JobFilterSidebar;
