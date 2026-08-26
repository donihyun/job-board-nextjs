"use client"
import { X } from "lucide-react";
import { ObjectId } from "mongoose";
import { deleteJob } from "@/actions/jobs.actions";
import {toast} from "sonner";
async function handleClick(jobId:string){
    try {
        const response = await deleteJob(jobId);
        toast("job successfully deleted");
    } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to delete job");
    }

}
const DeleteJobButton = ({jobId}:{jobId:string}) => {
    return (
        <button className="bg-pink-500 px-1 pl-10 py-9 h-full flex flex-col justify-center text-white font-semibold hover:opacity-80 hover:cursor-pointer"><X/></button>
    )
}
export default DeleteJobButton;