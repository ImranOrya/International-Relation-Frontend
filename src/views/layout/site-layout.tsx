import SiteNavbar from "@/components/custom-ui/navbar/SiteNavbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";
import FooterSection from "../site/general/footer/footer-section";

export default function SiteLayout() {
  return (
    <div className="flex flex-col min-h-[100vh] max-h-[100vh] bg-secondary overflow-auto select-none">
      <SiteNavbar />
      <Outlet />
      <Toaster />
      <FooterSection />
    </div>
  );
}
