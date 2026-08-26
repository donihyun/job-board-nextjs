"use server"
import { connectToDB } from "@/lib/db"
import User from "@/lib/models/user.model";
import mongoose, { ObjectId } from "mongoose";
import Job from "@/lib/models/job-schema";
import { revalidatePath } from 'next/cache'
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { JobType, MidType, MidTypePopulate } from "@/lib/types/jobtype";
import { logger } from "@/lib/logger";
import { ApplicationStatus } from "@/lib/enums";
export async function saveJob(userId:string,jobId:string){
    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        logger.warn("Invalid job ID format in saveJob", { jobId });
        return { success: false, message: "Invalid job ID format", status: 400 };
    }

    var Id = new mongoose.Types.ObjectId(jobId);
    connectToDB();
    try {
        const response = await User.findOneAndUpdate(
            {clerkId:userId},
            {$push:{savedJobs:{job:Id,status:ApplicationStatus.NOT_APPLIED}}},
            {new: true}
        );
        if(response){
            logger.dbOperation("save job", "users", { userId, jobId });
            return { success: true, message: "Job saved successfully", status: 200 };
        }
        else{
            logger.error("Failed to save job - user not found", undefined, { userId, jobId });
            return { success: false, message: "User not found", status: 404 };
        }
    } catch (error) {
        logger.error("Exception while saving job", error, { userId, jobId });
        return { success: false, message: "Internal server error", status: 500 };
    }
;
}
interface Params{
    country:string
    industry:string,
    s:string,
    pageNumInt:number,
    type:string
}


export async function fetchJob({
  country,
  industry,
  s,
  pageNumInt,
  type
}: Params) {
  await connectToDB();

  logger.dbOperation("fetch jobs", "jobs", {
    country,
    industry,
    searchTerm: s,
    page: pageNumInt,
    type
  });

  const regex = new RegExp(s, 'i');
  const pageSize = 10;
  const skip = (pageNumInt - 1) * pageSize;

  try {
    // Base query object
    const baseQuery = {
      country,
      'title.en': { $regex: regex },
      ...(type && { contracttype: type }),
      ...(industry !== 'none' && { category: industry })
    };

    logger.debug('MongoDB query constructed', { query: baseQuery });

    const [joblist, nextPage] = await Promise.all([
      Job.find(baseQuery)
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      Job.find(baseQuery)
        .skip(pageNumInt * pageSize)
        .countDocuments()
    ]);

    logger.info("Jobs fetched successfully", {
      count: joblist.length,
      hasNextPage: nextPage > 0
    });

    // Force revalidation of the jobs page
    revalidatePath('/jobs');

    return { joblist, nextPage };
  } catch (error) {
    logger.error('Error fetching jobs', error, { country, industry, searchTerm: s });
    throw error; // Let the page component handle the error
  }
}
export async function deleteJob(jobId:string){
    const {userId} = auth();

    if(!userId){
        logger.warn("Delete job attempt without authentication", { jobId });
        return { success: false, message: "Not authenticated" };
    }

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        logger.warn("Invalid job ID format in deleteJob", { jobId });
        return { success: false, message: "Invalid job ID format" };
    }

    var Id = new mongoose.Types.ObjectId(jobId);

    try {
        await connectToDB();
        const response = await User.findOneAndUpdate(
            {clerkId:userId},
            {$pull:{savedJobs:{job:{$in:[Id]}}}},
            {new: true}
        );
        if(response){
            logger.dbOperation("delete job", "users", { userId, jobId });
            revalidatePath("../dashboard/jobs");
            return { success: true, message: "Job deleted successfully" };
        }
        else {
            logger.warn("Job deletion failed - user not found", { userId, jobId });
            return { success: false, message: "User not found" };
        }
    } catch (error) {
        logger.error("Failed to delete job", error, { userId, jobId });
        return { success: false, message: "Internal server error" };
    }
}
export async function changeStatus(jobId:string,stat:number){
    const {userId} = auth().protect()

    if(!userId){
        logger.warn("Status change attempt without authentication", { jobId });
        return { success: false, message: "Not authenticated" };
    }

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        logger.warn("Invalid job ID format in changeStatus", { jobId });
        return { success: false, message: "Invalid job ID format" };
    }

    // Validate status value
    if (typeof stat !== 'number' || stat < 0 || stat > 3) {
        logger.warn("Invalid status value", { jobId, stat });
        return { success: false, message: "Invalid status value" };
    }

    try{
        await connectToDB()
        const user = await User.findOne({clerkId:userId})
        if(!user){
            logger.warn("User not found for status change", { userId, jobId });
            return { success: false, message: "User not found" };
        }
        const jobList: MidType[] = user?.savedJobs;
        jobList.forEach((elem)=>{
            if(elem.job.toString() == jobId){
                const currentStatus = elem.status as number;
                if(stat > currentStatus){
                    elem.status = stat;
                }
                else if(stat == currentStatus){
                    if(currentStatus >= 1){
                        elem.status = currentStatus - 1;
                    }
                }
                logger.debug("Job status update", {
                    jobId,
                    requestedStatus: stat,
                    currentStatus,
                    newStatus: elem.status
                });
            }
        })
        const response = await user.save();
        if(response){
            logger.dbOperation("update job status", "users", { userId, jobId, newStatus: stat });
            revalidatePath("../dashboard/jobs")
            return { success: true, message: "Status changed successfully" };
        }
        else {
            logger.error("Failed to save status change", undefined, { userId, jobId });
            return { success: false, message: "Failed to update status" };
        }
    }
    catch(error){
        logger.error("Exception during status change", error, { userId, jobId, stat });
        return { success: false, message: "Internal server error" };
    }
}