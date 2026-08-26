"use server"
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import mongoose from "mongoose";
import { ApplicationStatus } from "@/lib/enums";

export async function POST(req:NextRequest,{ params }: { params: { jobId: string } }){
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(req, "strict");
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response;
    }
    const id = params.jobId;
    const {userId} = auth();

    if(!userId){
      logger.warn("Job save attempt without authentication", { jobId: id });
      return NextResponse.json(
        { success: false, message: 'User not signed in' },
        { status: 401 }
      );
    }

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid job ID format", { jobId: id });
      return NextResponse.json(
        { success: false, message: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    try {
      logger.authEvent("User authenticated for job save", { userId, jobId: id });
      await connectToDB();

      const user = await User.findOne({clerkId:userId});
      if (!user) {
        logger.error("User not found in database", undefined, { clerkId: userId });
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      const jobObjectId = new mongoose.Types.ObjectId(id);

      // Check if job already saved
      const alreadySaved = user.savedJobs.some(
        (savedJob: { job: mongoose.Types.ObjectId }) =>
          savedJob.job.toString() === id
      );

      if (alreadySaved) {
        logger.info("Job already saved", { userName: user.firstName, jobId: id });
        return NextResponse.json(
          { success: false, message: 'Job already saved' },
          { status: 409 }
        );
      }

      logger.dbOperation("save job", "users", { userId: user.firstName, jobId: id });
      user.savedJobs.push({ job: jobObjectId, status: ApplicationStatus.NOT_APPLIED });
      await user.save();

      logger.info("Job saved successfully", { userName: user.firstName, jobId: id });
      return NextResponse.json(
        { success: true, message: 'Job saved successfully' },
        { status: 200 }
      );
    } catch (error) {
      logger.error("Failed to save job", error, { userId, jobId: id });
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  }

export async function DELETE(req:NextRequest,{ params }: { params: { jobId: string } }){
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(req, "strict");
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response;
    }

    const id = params.jobId;
    const {userId} = auth();

    if(!userId){
      logger.warn("Job delete attempt without authentication", { jobId: id });
      return NextResponse.json(
        { success: false, message: 'User not signed in' },
        { status: 401 }
      );
    }

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn("Invalid job ID format for deletion", { jobId: id });
      return NextResponse.json(
        { success: false, message: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    try {
      logger.authEvent("User authenticated for job deletion", { userId, jobId: id });
      await connectToDB();

      const jobObjectId = new mongoose.Types.ObjectId(id);

      const result = await User.findOneAndUpdate(
        { clerkId: userId },
        { $pull: { savedJobs: { job: { $in: [jobObjectId] } } } },
        { new: true }
      );

      if (!result) {
        logger.error("User not found during job deletion", undefined, { clerkId: userId });
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      logger.dbOperation("delete job", "users", { userId, jobId: id });
      logger.info("Job deleted successfully", { userId, jobId: id });

      return NextResponse.json(
        { success: true, message: 'Job deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      logger.error("Failed to delete job", error, { userId, jobId: id });
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  }
