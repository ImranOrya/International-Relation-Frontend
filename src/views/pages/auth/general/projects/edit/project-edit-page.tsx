import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { ProjectHeaderType } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CloudDownload,
  CloudUpload,
  Database,
  Grip,
  NotebookPen,
  UserRound,
  Zap,
} from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { PermissionEnum, StatusEnum } from "@/lib/constants";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import { UserPermission } from "@/database/tables";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import IconButton from "@/components/custom-ui/button/IconButton";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import ProjectEditHeader from "./project-edit-header";
import EditCenterBudgetTab from "./steps/edit-center-budget-tab";
import EditOrganizationStructureTab from "./steps/edit-organization-structure-tab";
import EditChecklistTab from "./steps/edit-checklist-tab";
import EditDetailsTab from "@/views/pages/auth/general/projects/edit/steps/edit-details-tab";
import UploadMouDailog from "@/views/pages/auth/general/projects/edit/parts/upload-mou-dailog";

export default function ProjectEditPage() {
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<ProjectHeaderType | undefined>(
    undefined
  );
  const loadInformation = async () => {
    try {
      // const response = await axiosClient.get(`projects/header-info/${id}`);
      // if (response.status == 200) {
      // const header = response.data.header as ProjectHeaderType;
      // setUserData(header);
      setUserData({
        profile: undefined,
        name: "Save the children",
        status_id: 11,
        status: "Pending for schedule",
        registration_no: "NF-P-01",
        email: "notion@gmail.com",
        contact: "+93785764809",
      });
      // }
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

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  const per: UserPermission = user?.permissions.get(
    PermissionEnum.projects.name
  ) as UserPermission;
  const hasEdit =
    per.edit &&
    (userData?.status_id != StatusEnum.scheduled ||
      userData?.status_id == StatusEnum.has_comment);
  const hasRemove =
    per.delete &&
    (userData?.status_id != StatusEnum.scheduled ||
      userData?.status_id == StatusEnum.has_comment);
  const tableList = useMemo(
    () =>
      Array.from(per.sub).map(([key, _subPermission], index: number) => {
        return key == PermissionEnum.projects.sub.detail ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Database className="size-[18px]" />
            {t("detail")}
          </TabsTrigger>
        ) : key == PermissionEnum.projects.sub.center_budget ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <UserRound className="size-[18px]" />
            {t("center_budget")}
          </TabsTrigger>
        ) : key == PermissionEnum.projects.sub.organ_structure ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <NotebookPen className="size-[18px]" />
            {t("organ_structure")}
          </TabsTrigger>
        ) : key == PermissionEnum.projects.sub.checklist ? (
          <TabsTrigger
            className={`${selectedTabStyle}`}
            key={index}
            value={key.toString()}
          >
            <Grip className="size-[18px]" />
            {t("checklist")}
          </TabsTrigger>
        ) : undefined;
      }),
    []
  );
  const download = async () => {
    // 1. Create token
    try {
      const response = await axiosClient.get(`projects/download/mou/${id}`, {
        responseType: "blob", // Important to handle the binary data (PDF)
        onDownloadProgress: (_progressEvent) => {
          // Calculate download progress percentage
        },
      });
      if (response.status == 200) {
        // Create a URL for the file blob
        const file = new Blob([response.data], {
          type: ".zip",
        });
        // const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "register-form.zip";
        link.click();

        // Clean up the URL object after download
        window.URL.revokeObjectURL(fileURL);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 px-3 mt-2 pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("projects")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{userData?.name}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.projects.sub.detail.toString()}
        className="flex flex-col md:flex-row gap-x-3 gap-y-2 md:gap-y-0"
      >
        {!userData ? (
          <>
            <Shimmer className="min-h-fit sm:min-h-[80vh] w-full md:w-[300px]" />
            <Shimmer className="h-full w-full" />
          </>
        ) : (
          <>
            <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
              <ProjectEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
                hasEdit={hasEdit}
                hasRemove={hasRemove}
              />
              {tableList}

              {userData.status_id == StatusEnum.expired && (
                <IconButton
                  onClick={() => navigate(`/projects/extend/${id}`)}
                  className="hover:bg-primary/5 gap-x-4 grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] mx-auto transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2"
                >
                  <Zap
                    className={`size-[18px] pointer-events-none justify-self-end`}
                  />
                  <h1
                    className={`rtl:text-lg-rtl ltr:text-xl-ltr justify-self-start text-start font-semibold`}
                  >
                    {t("extend_reg")}
                  </h1>
                </IconButton>
              )}
              {userData.status_id == StatusEnum.document_upload_required && (
                <>
                  <NastranModel
                    size="lg"
                    isDismissable={false}
                    button={
                      <IconButton className="hover:bg-primary/5 gap-x-4 grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] mx-auto transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2">
                        <CloudUpload
                          className={`size-[18px] pointer-events-none justify-self-end`}
                        />
                        <h1
                          className={`rtl:text-lg-rtl ltr:text-xl-ltr justify-self-start text-start font-semibold`}
                        >
                          {t("up_mou")}
                        </h1>
                      </IconButton>
                    }
                    showDialog={async () => true}
                  >
                    <UploadMouDailog
                      onComplete={() =>
                        setUserData((prev: any) => ({
                          ...prev,
                          status_id: StatusEnum.pending_approval,
                        }))
                      }
                    />
                  </NastranModel>
                  <IconButton
                    onClick={download}
                    className="hover:bg-primary/5 gap-x-4 mx-auto grid grid-cols-[1fr_4fr] w-[90%] xxl:w-[50%] md:w-[90%] transition-all text-primary rtl:px-3 rtl:py-1 ltr:p-2"
                  >
                    <CloudDownload
                      className={`size-[18px] pointer-events-none justify-self-end`}
                    />
                    <h1
                      className={`rtl:text-lg-rtl ltr:text-xl-ltr font-semibold justify-self-start`}
                    >
                      {t("download_mou")}
                    </h1>
                  </IconButton>
                </>
              )}
            </TabsList>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.projects.sub.detail.toString()}
            >
              <EditDetailsTab hasEdit={hasEdit} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.projects.sub.center_budget.toString()}
            >
              <EditCenterBudgetTab hasEdit={hasEdit} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.projects.sub.organ_structure.toString()}
            >
              <EditOrganizationStructureTab hasEdit={hasEdit} />
            </TabsContent>
            <TabsContent
              className="flex-1 m-0"
              value={PermissionEnum.projects.sub.checklist.toString()}
            >
              <EditChecklistTab
                hasEdit={userData.status_id == StatusEnum.has_comment}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
