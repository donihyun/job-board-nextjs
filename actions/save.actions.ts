"use server"
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import type { JobId } from "@/lib/types";

interface HandleLikeResult {
  success: boolean;
  message: string;
}

async function handleLike(jobId: JobId): Promise<HandleLikeResult> {
    try {
        const { userId } = auth();

        if (!userId) {
            auth().redirectToSignIn();
            return { success: false, message: "User not authenticated" };
        }

        await connectToDB();

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        user.savedJobs.push(jobId);
        await user.save();

        return { success: true, message: "Job saved successfully" };
    } catch (error) {
        console.error("Error in handleLike:", error);
        return { success: false, message: "Failed to save job" };
    }
}

export default handleLike;