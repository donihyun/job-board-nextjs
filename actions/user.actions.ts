"use server"
import User from "@/lib/models/user.model"
import {connectToDB} from "@/lib/db"
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import type { ClerkUserData } from "@/lib/types";
import { CreateUserSchema } from "@/lib/types";

interface CreateUserSuccessResponse {
  status: 200;
  user: {
    _id: string;
    clerkId: string;
    email: string;
    username?: string;
    photo: string;
    firstName?: string;
    lastName?: string;
  };
}

interface CreateUserErrorResponse {
  status: 400;
  error: string | unknown;
}

type CreateUserResponse = CreateUserSuccessResponse | CreateUserErrorResponse;

export async function createUser(userData: ClerkUserData): Promise<CreateUserResponse> {
    try {
        // Validate input with Zod
        const validationResult = CreateUserSchema.safeParse(userData);

        if (!validationResult.success) {
            logger.error("User data validation failed", validationResult.error);
            return { status: 400, error: "Invalid user data format" };
        }

        await connectToDB();

        try {
            const newUser = await User.create(validationResult.data);

            if (!newUser || !newUser._id) {
                return { status: 400, error: "User.create returns nothing" };
            }

            return { status: 200, user: newUser };
        } catch (createError) {
            logger.error("Error creating user in database", createError);
            return { status: 400, error: createError };
        }

    } catch (error) {
        logger.error("Error in createUser", error);
        return { status: 400, error };
    }
}

export async function setUserName(userId:string, username:string){
    try{
        await connectToDB();
        const user = await User.findOne({clerkId:userId});
        user.username = username;
        const res = await user.save()
        if(res){
            logger.dbOperation("update username", "users", { userId, username });
            return {status:200};
        }
        else{
            logger.error("Failed to save username", undefined, { userId, username });
            return {status:400}
        }
    }
    catch(error){
        logger.error("Exception while setting username", error, { userId, username });
        return {status:400};
    }
}