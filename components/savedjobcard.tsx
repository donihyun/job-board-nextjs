"use client"
import Link from "next/link";
import { Search,X,LoaderCircle} from 'lucide-react';
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import { deleteJob } from "@/actions/jobs.actions";
import { Check } from 'lucide-react';
import { revalidatePath } from "next/cache";
import { setSourceMapsEnabled } from "process";
function SavedJobCard({category, jobId}:{category:string, jobId:string}) {
    const [opened,setOpened] = useState(false);
    const [isLoading,setIsLoading] = useState(0);
    async function handleClick(jobId:string){
        setIsLoading(1);
        try {
            const response = await deleteJob(jobId);
            if(response.success == true){
                setOpened(false);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }

    }
    function handleStart(){
        setOpened(true);
        setIsLoading(0);
    }
    return(
            <div className="flex-col flex gap-y-0 h-max z-[10] items-center animate transition -translate-x-20 duration-500 group-hover/total:-translate-x-9 rounded-md ">
                <Link href={`../canada/jobs?${new URLSearchParams({category:category})}`} className="bg-indigo-500 px-1 pl-10 flex flex-col justify-center py-9 text-white font-semibold hover:opacity-80 hover:cursor-pointer"><Search/></Link>
                <Dialog open={opened} onOpenChange={setOpened}>
                    <DialogTrigger>
                        <button onClick = {handleStart} className="bg-pink-500 px-1 pl-10 py-9 h-full flex flex-col justify-center text-white font-semibold hover:opacity-80 hover:cursor-pointer"><X/></button>
                    </DialogTrigger>
                    <DialogContent>
                        {(isLoading == 2) ? (
                            <div className="w-full p-5 h-full flex flex-col text-xl font-semibold items-center justify-center gap-x-8">
                            <div>Job Successfully Deleted</div>
                            <div><Check className="text-green-500 font-semibold text-3xl"/></div>
                          </div>
                        ) 
                        : (
                            <div>
                                <DialogHeader>
                                <DialogTitle>Delete this Job?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end w-full gap-x-5 mt-3 items-center">
                                    <Button className="z-10 bg-black w-[100px]"  onClick={()=>{handleClick(jobId)}}>
                                        {(isLoading==0)? "Delete" : <LoaderCircle className="animate-spin"/>}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button type="button" className="w-[100px]" variant="secondary">
                                        Close
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
    )
}
export default SavedJobCard;