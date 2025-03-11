import JobPage from "@/components/JobPage";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
interface PageProps {
  params: { slug: string };
}

const getJob = cache(async (slug: string) => {
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job) notFound();

  return job;
});
export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const job = await getJob(slug);

  return {
    title: job.title,
  };
}
export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: { approved: true },
    select: { slug: true },
  });

  return jobs.slice(0, 10).map((job) => ({
    slug: job.slug, // must be an object 😂
  }));
}

export default async function Page({ params: { slug } }: PageProps) {
  const job = await getJob(slug);

  const { applicationEmail, applicationUrl } = job;

  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;

  if (!applicationLink) {
    console.error("Job has no application link or email");
    notFound();
  }

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job} />
      <aside>
        <Button asChild>
          <a href={applicationLink} className="w-40 md:w-fit">
            Apply now
          </a>
        </Button>
      </aside>
    </main>
  );
}
