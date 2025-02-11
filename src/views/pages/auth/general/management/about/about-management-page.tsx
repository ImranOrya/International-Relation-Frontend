import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Languages, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import TechnicalTab from "./sections/technical-tab";
import DirectorTab from "./sections/director-tab";
import ManagerTab from "./sections/manager-tab";
import OfficeTab from "./sections/office-tab";
import SliderSection from "./sections/slider-section";

export default function AboutManagementPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <Tabs
      dir={direction}
      defaultValue="tech"
      className="flex flex-col items-center"
    >
      <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
        <TabsTrigger
          value="tech"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("technical")}
        </TabsTrigger>
        <TabsTrigger
          value="dir"
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("director")}
        </TabsTrigger>
        <TabsTrigger
          value="mang"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("manager")}
        </TabsTrigger>
        <TabsTrigger
          value="slid"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("slider")}
        </TabsTrigger>
        <TabsTrigger
          value="off"
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("office")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tech" className="w-full px-4 pt-8">
        <TechnicalTab />
      </TabsContent>
      <TabsContent value="dir" className="w-full px-4 pt-8">
        <DirectorTab />
      </TabsContent>
      <TabsContent value="mang" className="w-full px-4 pt-8">
        <ManagerTab />
      </TabsContent>
      <TabsContent value="slid" className="w-full px-4 pt-8">
        <SliderSection />
      </TabsContent>
      <TabsContent value="off" className="w-full px-4 pt-8">
        <OfficeTab />
      </TabsContent>
    </Tabs>
  );
}
