import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent} from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {Webhook} from "svix";
import { createUser } from "@/actions/user.actions";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ClerkUserData } from "@/lib/types";
import { CreateUserSchema } from "@/lib/types";
export async function POST(req: NextRequest) {
    // Apply very strict rate limiting for webhooks
    const rateLimitResult = await checkRateLimit(req, "veryStrict");
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response;
    }
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }
  
    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')
  
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.warn("Missing svix headers in webhook request");
      return NextResponse.json(
        { success: false, message: 'Missing svix headers' },
        { status: 400 }
      );
    }
  
    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)
  
    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)
  
    let evt: WebhookEvent
  
    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err) {
      logger.error('Webhook verification failed', err);
      return NextResponse.json(
        { success: false, message: 'Webhook verification failed' },
        { status: 400 }
      );
    }
  
    // Do something with the payload
    const { id } = evt.data
    const eventType = evt.type

    if(eventType == "user.created"){
        const {id,email_addresses,image_url,first_name,last_name,username} = evt.data;
        const userData: ClerkUserData = {
            clerkId : id,
            email:email_addresses[0].email_address,
            username:username!,
            firstName: first_name,
            lastName:last_name,
            photo: image_url,
        }

        // Validate user data with Zod
        const validationResult = CreateUserSchema.safeParse(userData);
        if (!validationResult.success) {
          logger.error("Invalid user data from Clerk webhook", validationResult.error, { clerkId: id });
          return NextResponse.json(
            {
              success: false,
              message: "Invalid user data",
              errors: validationResult.error.issues,
            },
            { status: 400 }
          );
        }

        logger.authEvent("New user webhook received", { clerkId: id, email: userData.email });

        const response = await createUser(userData);
        if(response.status == 200){
            await clerkClient.users.updateUserMetadata(id,{
                publicMetadata:{
                    userId:response.user._id,
                }
            })
            logger.info("User created successfully", { userId: response.user._id, clerkId: id });
            return NextResponse.json({
              success: true,
              message: "User created successfully",
              data: { user: response.user }
            });
        }
        else{
          logger.error("Failed to create user", response.error, { clerkId: id });
          return NextResponse.json(
            {
              success: false,
              message: "Failed to create user",
              error: response.error
            },
            { status: 500 }
          );
        }
    }

    logger.info("Webhook processed", { webhookId: id, eventType });

    return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 })
  }