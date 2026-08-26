"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"
import ArrowButton from "@/components/arrowbutton";
import { Loader,MousePointer2,Speech,PartyPopper } from 'lucide-react';
import { changeStatus } from "@/actions/jobs.actions"
import { ArrowRight } from "lucide-react"
import { motion } from 'framer-motion'
import { Search,X,LoaderCircle} from 'lucide-react';
import {useState} from "react";
import { ApplicationStatus, getApplicationStatusLabel } from "@/lib/enums";

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

const DialogUI = ({jobId, current}:{jobId:string, current:number}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError,setIsError] = useState(false);
    async function handleClick(jobId:string, index:number){
        setIsLoading(true);
        const response = await changeStatus(jobId,index).catch((error)=>console.error("Error changing status:", error));
        if(response?.success == true){
            setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            }
        else{
            setIsError(true);
        }
    }
    if(isError){
        return(
            <div>
                <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-x-8">
                    <h1>Something went wrong!</h1>
                </DialogTitle>
                <DialogDescription>
                    Please try again later.
                </DialogDescription>
                </DialogHeader>
            </div>
        )
    }
    return (
        <div>
            <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-x-8">
                    <h1>Job Apply Progress</h1>
                    {isLoading ? (
                        <LoaderCircle className= "animate-spin" />
                    ):<div></div>}
                </DialogTitle>
                <DialogDescription>
                </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center mt-7 w-full px-1 md:px-3 lg:px-5 px-auto gap-x-0">
                        {status.map((stat)=>(
                            <div key={stat.index} >
                                <motion.button
                                    className={`relative flex-1 py-1 px-2 md:px-4 md:py-2 lg:py-4 lg:px-8 text-center md:text-md text-sm lg:text-lg font-medium transition-colors duration-100 ease-in-out
                                    ${stat.index === 0 ? 'rounded-l-full' : stat.index === 3? 'rounded-r-full' : ''}
                                    ${stat.index <= current ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                    onClick={()=>handleClick(jobId,stat.index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                    backgroundColor: stat.index <= current ? '#4f46e5' : '#e5e7eb',
                                    color: stat.index <= current ? '#ffffff' : '#4b5563',
                                    }}
                                >
                                    {stat.status}
                                    {stat.index < current && (
                                    <div
                                        className={`absolute right-0 top-0 bottom-0 w-6 overflow-hidden ${
                                        stat.index <= current ? 'text-indigo-600' : 'text-gray-200'
                                        }`}
                                        style={{ transform: 'translateX(100%)' }}
                                    >
                                        <div
                                        className={`h-full w-full bg-white transform origin-top-left -skew-x-12 ${
                                            stat.index <= current ? 'shadow-indigo' : 'shadow-gray'
                                        }`}
                                        ></div>
                                    </div>
                                    )}
                                </motion.button>
                            </div>
                        ))}
                </div>
        </div>
    )
}

export default DialogUI;