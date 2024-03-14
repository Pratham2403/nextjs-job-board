"use server" //server component is used in this file

import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/utils"
import { currentUser } from "@clerk/nextjs"
import { del } from "@vercel/blob" //blob is a Storage API to store static assets like images, videos, and documents
import { revalidatePath } from "next/cache" //next cache is used to cache the data
import { redirect } from "next/navigation" // next nvigation is used to navigate to different pages

type FormState = { error?: string } | undefined

export async function approveSubmission(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    try {
        const jobId = parseInt(formData.get("jobId") as string)
        const user = await currentUser()

        if (!user || !isAdmin(user)) {
            throw new Error("You are not authorized to perform this action")
        }

        await prisma.job.update({
            where: { id: jobId },
            data: { approved: true },
        })

        revalidatePath("/") //After Deleting take back to the root
    } catch (error) {
        let message = "Unexpected error"
        if (error instanceof Error) {
            //Agar koi genuine error hai toh uska message show karo
            message = error.message
        }

        return { error: message }
    }
}

export async function deleteJob(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    try {
        const jobId = parseInt(formData.get("jobId") as string)
        const user = await currentUser()

        if (!user || !isAdmin(user)) {
            throw new Error("You are not authorized to perform this action")
        }

        //Saari ki saari job parameters pick kari for that particular user/id
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        })

        //Agar uss job mein Logo hai TO hi delete karo
        if (job?.companyLogoUrl) {
            await del(job.companyLogoUrl)
        }
        await prisma.job.delete({
            where: { id: jobId },
          });
        revalidatePath("/") //Helps to parse cache data in Demand
    } catch (error) {
        let message = "Unexpected error"
        if (error instanceof Error) {
            //Agar koi genuine error hai toh uska message show karo
            message = error.message
        }

        return { error: message }
    }

    redirect("/admin")
}
