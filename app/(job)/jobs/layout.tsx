import Container from "@/components/container";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import BarforHeader from "@/components/barforheader";
export default async function CountryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Container>
      <BarforHeader firstName="" lastName="" userName="" photo="" />
      {children}
      <Footer/>
    </Container>
    <Toaster/>
    </>
  );
}
