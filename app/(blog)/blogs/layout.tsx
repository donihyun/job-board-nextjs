import React from "react";
import Container from "@/components/container";
import Footer from "@/components/footer";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@clerk/nextjs/server";
import BarforHeader from "@/components/barforheader";
import { redirect } from "next/navigation";
export default async function blogLayout({children}:{children:React.ReactNode}){
    const {userId} = auth();
    let firstName="";
    let lastName="";
    let userName = ""
    let photourl="";
    if(userId){
        await connectToDB();
        const currentUser = await User.findOne({clerkId:userId});
        if(!(currentUser?.username || currentUser?.firstName || currentUser?.lastName)){
        redirect("/setinfo");
    }
    firstName = currentUser.firstName ?? "";
    lastName = currentUser.lastName ?? "";
    userName = currentUser.username ?? "";
    photourl = currentUser.photo ?? "";
  }
    return(
    <>
    <Container>
      <BarforHeader firstName = {firstName}  lastName = {lastName} userName={userName} photo = {photourl} enableScrollAnimation={false} />
      {children}
      <Footer/>
    </Container>
    <Toaster/>
    </>
    )
}
