"use client"
import { changeStatus } from "@/actions/jobs.actions"
import { ArrowRight } from "lucide-react"
import { motion } from 'framer-motion'
const ArrowButton = ({current,text,index,jobId}:{current:number, text:string,index:number,jobId:string}) => {
    async function handleClick(){
        const response = await changeStatus(jobId,index).catch((error)=>console.error("Error changing status:", error));
    }
    return(
      <motion.button
            className={`relative flex-1 py-1 px-2 md:px-4 md:py-2 lg:py-4 lg:px-8 text-center md:text-md text-sm lg:text-lg font-medium transition-colors duration-300 ease-in-out
              ${index === 0 ? 'rounded-l-full' : index === 3? 'rounded-r-full' : ''}
              ${index <= current ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: index <= current ? '#4f46e5' : '#e5e7eb',
              color: index <= current ? '#ffffff' : '#4b5563',
            }}
          >
            {text}
            {index < current && (
              <div
                className={`absolute right-0 top-0 bottom-0 w-6 overflow-hidden ${
                  index <= current ? 'text-indigo-600' : 'text-gray-200'
                }`}
                style={{ transform: 'translateX(100%)' }}
              >
                <div
                  className={`h-full w-full bg-white transform origin-top-left -skew-x-12 ${
                    index <= current ? 'shadow-indigo' : 'shadow-gray'
                  }`}
                ></div>
              </div>
            )}
          </motion.button>
    )
}
export default ArrowButton
