import Container from "@/components/container";
import Footer from "@/components/footer";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import { auth } from "@clerk/nextjs/server";
import BarforHeader from "@/components/barforheader";
import { logger } from "@/lib/logger";

export default async function UserLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const db = await connectToDB();
    const {userId} = auth();

    let firstName="";
    let lastName="";
    let userName = ""
    let photourl="";

    if(userId){
      logger.authEvent("User accessing layout", { userId });
      const currentUser = await User.findOne({clerkId:userId});
      firstName = currentUser?.firstName ?? "";
      lastName = currentUser?.lastName ?? "";
      userName = currentUser?.username ?? "";
      photourl = currentUser?.photo ?? "";
    }
    return (
      <Container>
        <BarforHeader firstName = {firstName}  lastName = {lastName} userName = {userName} photo = {photourl}/>
        {children}
        <Footer/>
      </Container>
    );
  }