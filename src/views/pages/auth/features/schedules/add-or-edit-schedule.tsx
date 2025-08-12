import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomProjectSelect } from "./tabs/custom-project-select";
import { NormalProjectSelect } from "./tabs/normal-project-select";
import { useNavigate, useParams } from "react-router";
import EditScheduleTab from "./tabs/edit-schedule-tab";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { DateObject } from "react-multi-date-picker";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { useDatasource } from "@/hooks/use-datasource";
import { Project, ScheduleItem } from "@/database/tables";
import { FileType } from "@/lib/types";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { PlaneTakeoff, SquareX } from "lucide-react";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import TakePresentation from "@/views/pages/auth/features/schedules/tabs/parts/take-presentation";

export type Schedule = {
  date: DateObject;
  presentation_count: number;
  projects: Project[];
  scheduleItems: ScheduleItem[];
  start_time: string;
  end_time: string;
  time_format24h: boolean;
  presentation_length: number;
  gap_between: number;
  lunch_start: string;
  lunch_end: string;
  dinner_start: string;
  dinner_end: string;
  presentations_before_lunch: number;
  presentations_after_lunch: number;
  validation_checklist: any;
  special_projects: {
    project: { id: number; name: string };
    attachment: FileType;
  }[];
};
export default function AddOrEditSchedule() {
  const { t, i18n } = useTranslation();
  const [state] = useGlobalState();
  const [tab, setTab] = useState<string>("count");
  const direction = i18n.dir();
  const { data, "*": restPath } = useParams();
  const fullDate = restPath ? `${data}/${restPath}` : data;

  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const handleGoBack = () => navigate("/schedules", { replace: true });
  const paramData = useMemo(
    () =>
      new DateObject({
        date: fullDate,
        calendar: state.systemLanguage.calendar,
        locale: state.systemLanguage.local,
        format: "YYYY/MM/DD", // important for parsing correctly
      }),
    []
  );
  const loadList = async () => {
    if (paramData.isValid) {
      return {
        date: paramData,
        presentation_count: 10,
        projects: [],
        special_projects: [],
        scheduleItems: [],
        start_time: "08:00",
        end_time: "16:00",
        time_format24h: false,
        presentation_length: 45,
        gap_between: 5,
        lunch_start: "12:30",
        lunch_end: "13:30",
        dinner_start: "",
        dinner_end: "",
        presentations_before_lunch: 0,
        presentations_after_lunch: 0,
      };
    } else {
      const response = await axiosClient.get(`schedules/${data}`);
      const result = response.data;
      const date = new DateObject({
        date: result.date,
        calendar: state.systemLanguage.calendar,
        locale: state.systemLanguage.local,
        format: "YYYY/MM/DD", // important for parsing correctly
      });
      const projects: Project[] = [];
      const special_projects: {
        project: { id: number; name: string };
        attachment: FileType;
      }[] = [];

      for (const item of result.scheduleItems) {
        const proj = {
          id: item.projectId,
          name: item.project_name,
          attachment: item?.attachment,
          selected: true,
        };
        projects.push(proj);
        if (proj?.attachment)
          special_projects.push({
            project: { id: proj.id, name: proj.name },
            attachment: proj?.attachment,
          });
      }
      return {
        date: date,
        presentation_count: result.presentation_count,
        projects: projects,
        special_projects: special_projects,
        scheduleItems: result.scheduleItems,
        start_time: result.start_time,
        end_time: result.end_time,
        time_format24h: result.time_format24h,
        presentation_length: result.presentation_length,
        gap_between: result.gap_between,
        lunch_start: result.lunch_start,
        lunch_end: result.lunch_end,
        dinner_start: result?.dinner_start,
        dinner_end: result?.dinner_end,
        presentations_before_lunch: result.presentations_before_lunch,
        presentations_after_lunch: result.presentations_after_lunch,
      };
    }
  };
  const { schedule, setSchedule, isLoading, refetch } = useDatasource<
    Schedule | any,
    "schedule"
  >(
    {
      queryFn: loadList,
      queryKey: "schedule",
    },
    [],
    []
  );

  const tabStyle = useMemo(
    () =>
      "data-[state=active]:border-tertiary border-b-[2px] border-transparent data-[state=active]:border-b-[2px] h-full rounded-none",
    []
  );
  const cancel = () => {
    try {
    } catch (error: any) {}
  };
  return (
    <div className="px-2 pt-2 pb-12 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("schedules")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{fullDate}</BreadcrumbItem>
      </Breadcrumb>
      <Card className="w-full mt-2 self-center [backdrop-filter:blur(20px)] bg-card">
        <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card z-10 flex flex-row items-center justify-between">
          <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
            {t("schedule")}
          </CardTitle>
          <div className="flex gap-x-4">
            <NastranModel
              className="bg-card"
              size="full"
              isDismissable={false}
              button={
                <PrimaryButton
                  onClick={cancel}
                  className="items-center border bg-primary/5 hover:shadow-none shadow-none text-primary hover:text-primary hover:bg-primary/10"
                >
                  {t("take_presentation")}
                  <PlaneTakeoff />
                </PrimaryButton>
              }
              showDialog={async () => true}
            >
              <TakePresentation scheduleItems={schedule.scheduleItems} />
            </NastranModel>
            <PrimaryButton
              onClick={cancel}
              className="items-center border bg-red-400/20 hover:shadow-none shadow-none text-primary hover:text-primary hover:bg-red-400/70"
            >
              {t("cancel")}
              <SquareX />
            </PrimaryButton>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 p-0 pb-4 text-start">
          <Tabs
            onValueChange={setTab}
            dir={direction}
            className="p-0 h-full space-y-0"
            value={tab}
          >
            <TabsList className="overflow-x-auto border-b overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none">
              <TabsTrigger value={"count"} className={tabStyle}>
                <div className="rounded-full data-[state=active]:bg-tertiary bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "count"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    1
                  </span>
                </div>
                {t("count")}
              </TabsTrigger>
              <TabsTrigger value={"select"} className={tabStyle}>
                <div className="rounded-full bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "select"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    2
                  </span>
                </div>
                {t("select")}
              </TabsTrigger>
              <TabsTrigger value={"detail"} className={tabStyle}>
                <div className="rounded-full bg-primary ltr:mr-2 rtl:ml-2 text-primary-foreground size-[21px] flex items-center justify-center shadow-md ltr:text-[12px]">
                  <span
                    className={
                      tab == "detail"
                        ? "text-tertiary"
                        : "text-primary-foreground"
                    }
                  >
                    3
                  </span>
                </div>
                {t("detail")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={"count"} className="p-4">
              <NormalProjectSelect
                schedule={schedule}
                setSchedule={setSchedule}
              />
            </TabsContent>
            <TabsContent value={"select"} className="p-4">
              <CustomProjectSelect
                schedule={schedule}
                                add={paramData.isValid}
                setSchedule={setSchedule}
              />
            </TabsContent>
            <TabsContent value={"detail"} className="p-4">
              <EditScheduleTab
                add={paramData.isValid}
                schedule={schedule}
                setSchedule={setSchedule}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
