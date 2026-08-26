import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { MidTypePopulate } from "@/lib/types/jobtype";
import { auth } from "@clerk/nextjs/server";
import Country from "@/lib/models/job-schema";
import { Loader,MousePointer2,Speech,PartyPopper,Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"
import { MoveRight } from "lucide-react";
import SavedJobCard from "@/components/savedjobcard";
import DialogUI from "@/components/dialogui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ApplicationStatus, getApplicationStatusLabel } from "@/lib/enums";
import { logger } from "@/lib/logger";

const status = [
    {
        index: ApplicationStatus.NOT_APPLIED,
        status: getApplicationStatusLabel(ApplicationStatus.NOT_APPLIED),
        class:"bg-amber-100 text-amber-600",
        icon:<Loader/>
    },
    {
        index: ApplicationStatus.APPLIED,
        status: getApplicationStatusLabel(ApplicationStatus.APPLIED),
        class:"bg-indigo-100 text-indigo-600",
        icon:<MousePointer2/>
    },
    {
        index: ApplicationStatus.INTERVIEWED,
        status: getApplicationStatusLabel(ApplicationStatus.INTERVIEWED),
        class:"bg-orange-100 text-orange-600",
        icon:<Speech/>
    },
    {
        index: ApplicationStatus.ACCEPTED,
        status: getApplicationStatusLabel(ApplicationStatus.ACCEPTED),
        class:"bg-green-100 text-green-600",
        icon:<PartyPopper/>
    },
]
async function SavedJobPage() {
    revalidatePath("/MyJobs");
    const {userId} = auth().protect()
    logger.authEvent("User accessing saved jobs", { userId });
    await connectToDB();
    let joblist:MidTypePopulate[] = []
    if(!userId){return null;}
    else{
        const temp = await Country.find({})
        const userJob = await User.findOne({clerkId:userId}).populate('savedJobs.job');   
        if(!userJob){
            return(
                <section className="w-full relative min-h-screen overflow-y-auto">
                    <div className="mt-52 absolute relative left-[10%]">
                        <div className="flex mt-10 items-center gap-x-7">
                            <h1 className="font-bold text-3xl">Error!</h1>
                        </div>
                    </div>
                </section>
            )
        }
        else{
            if(!(userJob?.username || userJob?.firstName || userJob?.lastName)){
                redirect("/setinfo");
            }
        }
        joblist = userJob?.savedJobs ?? [];
    }
    if(joblist.length == 0){
        return(
            <section className="w-full bg-zinc-100 h-screen relative overflow-y-auto overflow-x-hidden">
            <div className="mt-40 absolute relative left-[10%]">
                <h2 className="font-bold text-xl text-indigo-600">My Jobs</h2>
                <div className="flex mt-6 items-center gap-x-7">
                    <h1 className="font-bold text-3xl">Saved Jobs</h1>
                    <div className="bg-zinc-200 text-black font-bold text-3xl p-3 rounded-full">{joblist.length}</div>
                </div>
                    <div className="mt-14">
                        <Link href={{pathname:`/jobs`, query:{country:"canada"}}} className="flex gap-x-5 group hover:cursor-pointer items-center">
                            <h1 className="font-bold text-2xl">Add Jobs</h1>
                            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white text-indigo-500"><Plus/></div>
                        </Link>
                    </div>
                </div>
            </section>
        )
    }
    else{
    return(
            <section className="w-full bg-zinc-100 relative min-h-screen overflow-y-auto overflow-x-hidden">
                <div className="mt-40 absolute relative left-[10%]">
                    <h2 className="font-bold text-xl text-indigo-600">My Jobs</h2>
                    <div className="flex mt-6 items-center gap-x-7">
                        <h1 className="font-bold text-3xl">Saved Jobs</h1>
                        <div className="bg-zinc-200 text-black font-bold text-3xl p-3 rounded-full">{joblist.length}</div>
                    </div>
                    {joblist.length == 0 ? (
                        <div className="mt-14">
                            <div className="flex gap-x-5 group hover:cursor-pointer items-center">
                                <h1 className="font-bold text-2xl">Add Jobs</h1>
                                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white text-indigo-500"><Plus/></div>
                            </div>
                        </div>
                    ):
                        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-5 w-max">
                            {joblist.map((elem,index)=>(
                                <div key={index}>
                                    <div className="flex group/total">
                                        <div className="w-[300px] z-20 h-[380px] group relative hover:cursor-pointer mb-5 bg-white rounded-md border-2 border-zinc-200 ">
                                            <Dialog>
                                                <DialogTrigger>
                                                <div className="w-[300px] h-full z-30 flex flex-col items-center gap-y-3 pt-5 pb-5 ">
                                                    <div className="w-10 h-10 relative overflow-hidden rounded-full border-2 border-zinc-500 z-10"><Image src={`/${elem.job.country}.png`} fill={true} objectFit="cover" alt="flag" className="z-10"/></div>
                                                    <h1 className="font-bold text-lg h-[80px] text-center px-5 flex w-full justify-center items-center" >{elem.job.title}</h1>
                                                    <div className={cn(status.find((stat)=>stat.index==elem.status)?.class,"font-medium flex gap-x-2 items-center rounded-full w-max px-3 py-1")}>
                                                        {status.find((stat)=>stat.index==elem.status)?.icon}
                                                        {status.find((stat)=>stat.index==elem.status)?.status}
                                                    </div>
                                                    <div className="flex flex-col mt-3 text-muted-foreground gap-y-4">
                                                    <div className="flex gap-x-2 text-zinc-900 items-center bg-zinc-200 rounded-full py-2 px-3">
                                                        <Image src="/business.svg" width={20} height={20} alt="city"/>
                                                        <h2 className="font-medium">{elem.job.company}</h2>
                                                    </div>
                                                    <div className="flex gap-x-2 items-center text-zinc-900 bg-zinc-200 rounded-full py-2 px-3">
                                                        <Image src="/location.svg" width={20} height={20} alt="company"/>
                                                        <p className="font-medium">{elem.job.location}</p>
                                                    </div>
                                                    </div>
                                                    <div className="w-full flex justify-center pb-3">
                                                    <Link href = {elem.job.url} className="text-indigo-600 p-1 rounded-full bg-white w-max px-4 animate border-2 border-white hover:border-indigo-600 hover:bg-indigo-600 hover:text-white duration-500 font-semibold flex gap-x-1">
                                                        Continue with CareerJet
                                                        <MoveRight className="transition w-[20px] transform group-hover:translate-x-1 duration-100"/>
                                                    </Link>
                                                    </div>
                                                </div>
                                                </DialogTrigger>
                                                <DialogContent className="md:max-w-[700px] lg:max-w-[1200px]">
                                                    <DialogUI jobId = {elem.job._id.toString()} current={elem.status as number}/>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <SavedJobCard category={elem.job.category} jobId={elem.job._id.toString()}/>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    }
                </div>
            </section>
    )
}
}
export default SavedJobPage;