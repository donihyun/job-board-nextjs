"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveJob } from "@/actions/jobs.actions";
import type { JobId } from "@/lib/types";

interface LikeButtonProps {
    jobId: JobId;
}

const LikeButton = ({ jobId }: LikeButtonProps) => {
    const router = useRouter();
    const { isSignedIn, userId } = useAuth();

    async function handleClick() {
        if (isSignedIn && userId) {
            try {
                const result = await saveJob(userId, String(jobId));
                if (!result || result.status !== 200) {
                    console.error("Failed to save job");
                }
            } catch (error) {
                console.error("Error saving job:", error);
            }
        } else {
            router.push("/sign-up");
        }
    }

    return (
        <button
            onClick={handleClick}
            className="z-10"
            aria-label="Save job"
        >
            <Image
                src="/purpleheart.svg"
                width={30}
                height={30}
                alt="heart"
                className="hidden group-hover:block z-10 hover:scale-105"
            />
        </button>
    );
}

export default LikeButton