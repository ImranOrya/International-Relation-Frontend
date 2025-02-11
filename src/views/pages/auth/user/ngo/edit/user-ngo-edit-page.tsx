import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AnimHomeIcon from "@/components/custom-ui/icons/AnimHomeIcon";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { NgoInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Database, Grip, NotebookPen, UserRound } from "lucide-react";
import UserNgoEditHeader from "./user-ngo-edit-header";
import EditDirectorTab from "./steps/edit-director-tab";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { StatusEnum } from "@/lib/constants";
import EditAgreemenTab from "./steps/edit-agreement-tab";
import EditMoreInformationTab from "./steps/edit-more-information-tab";
import EditInformationTab from "./steps/edit-information-tab";
import EditStatusTab from "./steps/edit-status-tab";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import AddNgo from "../add/add-ngo";

export interface INgoInformation {
  ngoInformation: NgoInformation;
  registerFormSubmitted: boolean;
}
export default function UserNgoEditPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<INgoInformation | undefined>(
    undefined
  );
  const loadInformation = async () => {
    try {
      setFailed(false);
      const response = await axiosClient.get(`ngo/header-info/${id}`);
      if (response.status == 200) {
        const ngo = response.data.ngo as NgoInformation;
        // Do not allow until register form is submitted
        const registerFormSubmitted =
          ngo.status_id == StatusEnum.register_form_submitted;
        if (
          ngo.status_id == StatusEnum.not_logged_in ||
          ngo.status_id == StatusEnum.unregistered
        ) {
          navigate(`/ngo/profile/edit/${id}`, {
            state: {
              data: { edit: true },
            },
          });
          return;
        } else {
          setUserData({
            ngoInformation: ngo,
            registerFormSubmitted: registerFormSubmitted,
          });
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const selectedTabStyle = `relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  return (
    <div className="flex flex-col gap-y-4 px-3 mt-2">
      <Breadcrumb className="rtl:text-2xl-rtl ltr:text-xl-ltr bg-card w-fit py-1 px-3 rounded-md border">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard">
              <AnimHomeIcon className=" text-primary" />
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem
            onClick={() => navigate("/ngo", { replace: true })}
            className="cursor-pointer"
          >
            <BreadcrumbPage className="text-primary/75">
              {t("ngo")}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rtl:rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary">
              {userData?.ngoInformation?.username}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="n_i"
        className="flex flex-col md:flex-row gap-x-3 gap-y-2 md:gap-y-0"
      >
        {!userData ? (
          <>
            <Shimmer className="min-h-fit sm:min-h-[80vh] w-full md:w-[300px]" />
            <Shimmer className="h-full w-full" />
          </>
        ) : (
          <>
            <TabsList className="pb-4 min-h-fit sm:min-h-[80vh] h-fit md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
              <UserNgoEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
              />
              <TabsTrigger
                className={`mt-6 rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
                value="n_i"
              >
                <Database className="size-[18px]" />
                {t("ngo_information")}
              </TabsTrigger>
              <TabsTrigger
                className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
                value="d_i"
              >
                <UserRound className="size-[18px]" />
                {t("director_information")}
              </TabsTrigger>
              <TabsTrigger
                className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
                value="a_c"
              >
                <NotebookPen className="size-[18px]" />
                {t("agreement_checklist")}
              </TabsTrigger>
              <TabsTrigger
                className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
                value="m_i"
              >
                <Grip className="size-[18px]" />
                {t("more_information")}
              </TabsTrigger>
              <TabsTrigger
                className={`rtl:text-xl-rtl ltr:text-lg-ltr ${selectedTabStyle}`}
                value="s_i"
              >
                <Activity className="size-[18px]" />
                {t("status")}
              </TabsTrigger>

              {userData?.ngoInformation?.registration_expired && (
                <NastranModel
                  size="lg"
                  isDismissable={false}
                  button={
                    <PrimaryButton className="rtl:text-lg-rtl font-semibold w-[80%] mx-auto mt-4 ltr:text-md-ltr">
                      {t("extend_reg")}
                    </PrimaryButton>
                  }
                  showDialog={async () => true}
                >
                  <AddNgo onComplete={() => {}} />
                </NastranModel>
              )}
              {userData?.registerFormSubmitted && (
                <NastranModel
                  size="lg"
                  isDismissable={false}
                  button={
                    <PrimaryButton className="rtl:text-lg-rtl font-semibold w-[80%] mx-auto mt-4 ltr:text-md-ltr">
                      {t("extend_reg")}
                    </PrimaryButton>
                  }
                  showDialog={async () => true}
                >
                  <AddNgo onComplete={() => {}} />
                </NastranModel>
              )}
            </TabsList>
            <TabsContent className="flex-1 m-0" value="n_i">
              <EditInformationTab />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="d_i">
              <EditDirectorTab />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="a_c">
              <EditAgreemenTab />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="m_i">
              <EditMoreInformationTab />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="s_i">
              <EditStatusTab />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
