"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { SignedIn,SignedOut } from "@clerk/nextjs";
import Link from "next/link";
interface Profile{
  firstName:string, 
  lastName: string,
  userName:string,
  photo: string,
}
const UserBar = ({firstName,lastName,userName, photo}:Profile) => {
    const name = (firstName || lastName) ? `${firstName} ${lastName}` : userName
    return (
      <div>
        <SignedOut>
          <Link href = "/sign-in" className="w-full h-full">
            <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
              <h1 className="text-semibold">Login</h1>
              <User/>
            </div>
          </Link>
        </SignedOut>
        <SignedIn>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <div className="flex justify-center ">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-700 bg-white">
                  <div className="w-[85%] h-[85%] rounded-full relative overflow-hidden">
                    <Image src={photo} fill={true} alt="profilepic" />
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><SignOutButton/></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
      </div>
      )
}
export default UserBar;
