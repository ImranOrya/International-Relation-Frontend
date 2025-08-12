import CustomInput from "@/components/custom-ui/input/CustomInput";
import { RefreshCcw } from "lucide-react";
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
import axiosClient from "@/lib/axois-client";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useNgoAuthState } from "@/context/AuthContextProvider";
import { ValidateItem } from "@/validation/types";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { Dispatch, SetStateAction } from "react";

interface EditNgoProfileInformationProps {
  loading: boolean;
  failed: boolean;
  setLoading: any;
  ngoData: any;
  setError: Dispatch<SetStateAction<Map<string, string>>>;
  setNgoData: any;
  error: Map<string, string>;
  loadInformation: () => void;
}
export default function EditNgoProfileInformation(
  props: EditNgoProfileInformationProps
) {
  const {
    loading,
    setLoading,
    ngoData,
    setError,
    failed,
    setNgoData,
    error,
    loadInformation,
  } = props;
  const { user, setNgo } = useNgoAuthState();
  const { t } = useTranslation();

  const saveData = async () => {
    if (loading) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate data changes
    // 2. Validate form
    const compulsoryFields: ValidateItem[] = [
      { name: "name_english", rules: ["required", "max:128", "min:5"] },
      { name: "name_farsi", rules: ["required", "max:128", "min:5"] },
      { name: "name_pashto", rules: ["required", "max:128", "min:5"] },
      { name: "abbr", rules: ["required"] },
      { name: "type", rules: ["required"] },
      { name: "contact", rules: ["required"] },
      { name: "email", rules: ["required"] },
      { name: "province", rules: ["required"] },
      { name: "district", rules: ["required"] },
      { name: "area_english", rules: ["required", "max:128", "min:5"] },
      { name: "area_pashto", rules: ["required", "max:128", "min:5"] },
      { name: "area_farsi", rules: ["required", "max:128", "min:5"] },
    ];
    const passed = await validate(compulsoryFields, ngoData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("contents", JSON.stringify(ngoData));
    try {
      const response = await axiosClient.post("ngos/profile", formData);
      if (response.status == 200) {
        const fileds_update = response.data.fileds_update;
        setNgo({ ...user, ...fileds_update });
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
              title={t("ngo_name")}
              required={true}
              parentClassName="p-t-4 pb-0 px-0"
              className="grid grid-cols-1 gap-y-3"
            >
              <MultiTabInput
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
                name="name"
                highlightColor="bg-tertiary"
                userData={ngoData}
                errorData={error}
                placeholder={t("content")}
                className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                tabsClassName="gap-x-5 px-3"
              >
                <SingleTab>english</SingleTab>
                <SingleTab>farsi</SingleTab>
                <SingleTab>pashto</SingleTab>
              </MultiTabInput>
            </BorderContainer>

            <CustomInput
              required={true}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              lable={t("abbr")}
              name="abbr"
              defaultValue={ngoData["abbr"]}
              placeholder={t("abbr_english")}
              type="text"
              className="uppercase"
              errorMessage={error.get("abbr")}
              onBlur={(e: any) => {
                const { name, value } = e.target;
                setNgoData({ ...ngoData, [name]: value });
              }}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) =>
                setNgoData({ ...ngoData, ["type"]: selection })
              }
              lable={t("type")}
              required={true}
              requiredHint={`* ${t("required")}`}
              selectedItem={ngoData["type"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("type")}
              apiUrl={"ngo-types"}
              mode="single"
              readonly={true}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              required={true}
              requiredHint={`* ${t("required")}`}
              className="rtl:text-end"
              lable={t("contact")}
              placeholder={t("enter_ur_pho_num")}
              defaultValue={ngoData["contact"]}
              type="text"
              name="contact"
              errorMessage={error.get("contact")}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setNgoData({ ...ngoData, [name]: value });
              }}
            />
            <CustomInput
              size_="sm"
              name="email"
              required={true}
              requiredHint={`* ${t("required")}`}
              lable={t("email")}
              defaultValue={ngoData["email"]}
              placeholder={t("enter_your_email")}
              type="email"
              errorMessage={error.get("email")}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setNgoData({ ...ngoData, [name]: value });
              }}
              dir="ltr"
              className="rtl:text-right"
            />

            <BorderContainer
              title={t("head_office_add")}
              required={true}
              parentClassName="mt-3"
              className="flex flex-col items-start gap-y-3"
            >
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setNgoData({ ...ngoData, ["province"]: selection })
                }
                lable={t("province")}
                required={true}
                selectedItem={ngoData["province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("province")}
                apiUrl={"provinces/" + 1}
                mode="single"
              />
              {ngoData.province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setNgoData({ ...ngoData, ["district"]: selection })
                  }
                  lable={t("district")}
                  required={true}
                  selectedItem={ngoData["district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("district")}
                  apiUrl={"districts/" + ngoData?.province?.id}
                  mode="single"
                  key={ngoData?.province?.id}
                />
              )}

              {ngoData.district && (
                <MultiTabInput
                  title={t("area")}
                  parentClassName="w-full"
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
                  name="area"
                  highlightColor="bg-tertiary"
                  userData={ngoData}
                  errorData={error}
                  placeholder={t("content")}
                  className="rtl:text-xl-rtl"
                  tabsClassName="gap-x-5"
                >
                  <SingleTab>english</SingleTab>
                  <SingleTab>farsi</SingleTab>
                  <SingleTab>pashto</SingleTab>
                </MultiTabInput>
              )}
            </BorderContainer>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={loadInformation}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          ngoData && (
            <PrimaryButton onClick={saveData} className={`shadow-lg`}>
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
