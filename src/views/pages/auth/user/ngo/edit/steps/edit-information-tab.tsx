import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
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
import {
  Country,
  District,
  NgoType,
  Province,
  UserPermission,
} from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useParams } from "react-router";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { ValidateItem } from "@/validation/types";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import { isString } from "@/lib/utils";
interface EditNgoInformationProps {
  registration_no: string;
  name_english: string | undefined;
  name_pashto: string;
  name_farsi: string;
  area_english: string;
  area_pashto: string;
  area_farsi: string;
  abbr: string;
  type: NgoType;
  contact: string;
  email: string;
  place_of_establishment: Country;
  moe_registration_no: string;
  country: Country;
  province: Province;
  district: District;
  establishment_date: DateObject;
  optional_lang: string;
}
export default function EditInformationTab() {
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
      const response = await axiosClient.get(`ngo/details/${id}`);
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
      { name: "name_english", rules: ["required", "max:128", "min:5"] },
      { name: "name_farsi", rules: ["required", "max:128", "min:5"] },
      { name: "name_pashto", rules: ["required", "max:128", "min:5"] },
      { name: "abbr", rules: ["required"] },
      { name: "type", rules: ["required"] },
      { name: "contact", rules: ["required"] },
      { name: "email", rules: ["required"] },
      { name: "moe_registration_no", rules: ["required"] },
      { name: "place_of_establishment", rules: ["required"] },
      { name: "establishment_date", rules: ["required"] },
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
    const content = {
      ...ngoData, // shallow copy of the userData object
      establishment_date: !isString(ngoData!.establishment_date)
        ? ngoData!.establishment_date?.toDate()?.toISOString()
        : ngoData!.establishment_date,
    };
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    formData.append("contents", JSON.stringify(content));
    try {
      const response = await axiosClient.post("ngo/update-info", formData);
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

            <CustomInput
              size_="sm"
              name="moe_registration_no"
              required={true}
              requiredHint={`* ${t("required")}`}
              lable={t("moe_registration_no")}
              defaultValue={ngoData["moe_registration_no"]}
              placeholder={t("enter_your_email")}
              type="moe_registration_no"
              errorMessage={error.get("moe_registration_no")}
              onChange={(e: any) => {
                const { name, value } = e.target;
                setNgoData({ ...ngoData, [name]: value });
              }}
              dir="ltr"
              className="rtl:text-right"
            />

            <BorderContainer
              title={t("place_of_establishment")}
              required={true}
              parentClassName="mt-3"
              className="flex flex-col items-stretch gap-y-3"
            >
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setNgoData({
                    ...ngoData,
                    ["place_of_establishment"]: selection,
                  })
                }
                lable={t("place_of_establishment")}
                required={true}
                selectedItem={ngoData["place_of_establishment"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("place_of_establishment")}
                apiUrl={"countries"}
                mode="single"
              />
              <CustomDatePicker
                placeholder={t("select_a_date")}
                lable={t("establishment_date")}
                requiredHint={`* ${t("required")}`}
                required={true}
                value={ngoData.establishment_date}
                dateOnComplete={(date: DateObject) => {
                  setNgoData({ ...ngoData, establishment_date: date });
                }}
                className="py-3 w-full"
                errorMessage={error.get("establishment_date")}
              />
            </BorderContainer>

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
                apiUrl={"provinces"}
                params={{ country_id: 1 }}
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
                  apiUrl={"districts"}
                  params={{ province_id: ngoData?.province?.id }}
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
