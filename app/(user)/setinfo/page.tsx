import { UserType } from "@/lib/types/jobtype";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { redirect } from 'next/navigation'
import { ProfileForm } from "@/components/usernameform";
import { logger } from "@/lib/logger";

async function setInfo(){
    const {userId} = auth().protect()
    logger.authEvent("User accessing setInfo page", { userId });
    await connectToDB();
    if(!userId){return null;}
    else{
        const user : UserType | null= await User.findOne({clerkId:userId})   
        if(!user){
          return(
            <section className="w-full relative min-h-screen overflow-x-hidden overflow-y-auto">
              <div className="mt-52 absolute relative left-[10%] ">
                  <h1 className="font-bold text-3xl">Error!</h1>
              </div>
            </section>
          )
        }
        if((user?.username || user?.firstName || user?.lastName)){
          redirect("/");
        }
    }
    return(
        <section className="w-full relative min-h-screen overflow-x-hidden overflow-y-auto">
        <div className="mt-52 absolute relative left-[10%] ">
            <h1 className="font-bold text-3xl">Type in your username</h1>
            <div className="mt-7 w-[65%]"><ProfileForm userId={userId}/></div>
        </div>
      </section>
    )
}
export default setInfo;