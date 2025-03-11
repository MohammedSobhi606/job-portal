"use server";
import prisma from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import path from "path";
export async function CreateJob(formData: FormData) {
  const values = Object.fromEntries(formData.entries()); // array of key, value pairs then object of this array using fromEntries() method
  // tranform the formdata to normal object to deal with it
  const {
    title,
    companyName,
    location,
    description,
    type,
    salary,
    locationType,
    applicationEmail,
    applicationUrl,
    companyLogo,
  } = createJobSchema.parse(values);
  const slug = `${toSlug(title)}-${nanoid(10)}`;

  let companyLogoUrl: string | undefined = undefined;

  if (companyLogo) {
    const blob = await put(
      `company_logos/${slug}${path.extname(companyLogo.name)}`,
      companyLogo,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );

    companyLogoUrl = blob.url;
  }

  try {
    await prisma.job.create({
      data: {
        slug,
        title,
        companyName,
        location,
        description,
        type,
        salary: parseInt(salary),
        locationType,
        applicationEmail,
        applicationUrl,
        companyLogoUrl,
      },
    });
  } catch (error) {
    console.log(error);
  }
  redirect("/jobs/job-submitted"); //redirect internally throws an error so it should be called outside of try/catch blocks.
}
