import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { UserPermission } from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useParams } from "react-router";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import { ValidateItem } from "@/validation/types";
import MultiTabTextarea from "@/components/custom-ui/input/mult-tab/MultiTabTextarea";
interface EditNgoInformationProps {
  introduction_english: string;
  vision_english: string;
  mission_english: string;
  general_objes_english: string;
  objes_in_afg_english: string;
  introduction_farsi: string;
  vision_farsi: string;
  mission_farsi: string;
  general_objes_farsi: string;
  objes_in_afg_farsi: string;
  introduction_pashto: string;
  vision_pashto: string;
  mission_pashto: string;
  general_objes_pashto: string;
  objes_in_afg_pashto: string;
  optional_lang: string;
}
export default function EditMoreInformationTab() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [ngoData, setNgoData] = useState<EditNgoInformationProps>();

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const hasEdit = per ? per?.edit : false;

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`ngo/more-information/${id}`);
      if (response.status == 200) {
        const ngo = response.data.ngo;
        if (ngo) setNgoData(ngo);
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
    setLoading(false);
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const saveData = async () => {
    if (loading || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate data changes
    // 2. Validate form
    const compulsoryFields: ValidateItem[] = [
      { name: "vision_english", rules: ["required", "min:10"] },
      { name: "vision_farsi", rules: ["required", "min:10"] },
      { name: "vision_pashto", rules: ["required", "min:10"] },
      { name: "mission_english", rules: ["required", "min:10"] },
      { name: "mission_farsi", rules: ["required", "min:10"] },
      { name: "mission_pashto", rules: ["required", "min:10"] },
      { name: "general_objes_english", rules: ["required", "min:10"] },
      { name: "general_objes_farsi", rules: ["required", "min:10"] },
      { name: "general_objes_pashto", rules: ["required", "min:10"] },
      { name: "objes_in_afg_english", rules: ["required", "min:10"] },
      { name: "objes_in_afg_farsi", rules: ["required", "min:10"] },
      { name: "objes_in_afg_pashto", rules: ["required", "min:10"] },
    ];
    const passed = await validate(compulsoryFields, ngoData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }

    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    formData.append("content", JSON.stringify(ngoData));
    try {
      const response = await axiosClient.post(
        "ngo/more-information/updated",
        formData
      );
      if (response.status == 200) {
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : ngoData === undefined ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-x-4 gap-y-6 w-full xl:w-1/2">
            <BorderContainer
              title={t("vision")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="vision"
                rows={8}
                highlightColor="bg-tertiary"
                userData={ngoData}
                errorData={error}
                placeholder={t("content")}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0 resize-none"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabTextarea>
            </BorderContainer>

            <BorderContainer
              title={t("mission")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="mission"
                highlightColor="bg-tertiary"
                userData={ngoData}
                errorData={error}
                placeholder={t("content")}
                rows={8}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabTextarea>
            </BorderContainer>

            <BorderContainer
              title={t("general_objes")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="general_objes"
                highlightColor="bg-tertiary"
                userData={ngoData}
                errorData={error}
                placeholder={t("content")}
                rows={8}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabTextarea>
            </BorderContainer>

            <BorderContainer
              title={t("objes_in_afg")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabTextarea
                optionalKey={"optional_lang"}
                onTabChanged={(key: string, tabName: string) => {
                  setNgoData({
                    ...ngoData,
                    [key]: tabName,
                    optional_lang: tabName,
                  });
                }}
                onChanged={(value: string, name: string) => {
                  setNgoData({
                    ...ngoData,
                    [name]: value,
                  });
                }}
                name="objes_in_afg"
                highlightColor="bg-tertiary"
                userData={ngoData}
                errorData={error}
                placeholder={t("content")}
                rows={8}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabTextarea>
            </BorderContainer>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await loadInformation()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          ngoData &&
          hasEdit && (
            <PrimaryButton
              onClick={async () => {
                if (user?.permissions.get(SectionEnum.users)?.edit)
                  await saveData();
              }}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
