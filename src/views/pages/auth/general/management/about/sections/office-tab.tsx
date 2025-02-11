import Card from "@/components/custom-ui/card/Card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { t } from "i18next";
import { useEffect, useState } from "react";
import { setServerError, validate } from "@/validation/validation";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { StaffEnum } from "@/lib/constants";
import StaffInputs from "./parts/staff-inputs";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";

export default function OfficeTab() {
  const [loading, setLoading] = useState(false);
  const [manipulating, setManipulating] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    picture: undefined,
    address_english: "",
    address_farsi: "",
    address_pashto: "",
    contact: "",
    email: "",
    optional_lang: "",
    editable: false,
  });
  const [error, setError] = useState<Map<string, string>>(new Map());

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("office");
      if (response.status == 200) {
        // 1. Add data to list
        if (response.data.office) {
          const data = response.data.office;
          const item = {
            id: data.id,
            picture: data.picture,
            address_english: data.address_english,
            address_farsi: data.address_farsi,
            address_pashto: data.address_pashto,
            contact: data.contact,
            email: data.email,
            optional_lang: "",
            editable: true,
          };
          setUserData(item);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const saveData = async () => {
    if (loading) {
      return;
    }
    setManipulating(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "address_english",
          rules: ["required", "max:100", "min:3"],
        },
        {
          name: "address_farsi",
          rules: ["required", "max:100", "min:3"],
        },
        {
          name: "address_pashto",
          rules: ["required", "max:100", "min:3"],
        },
        {
          name: "contact",
          rules: ["required"],
        },
        {
          name: "email",
          rules: ["required"],
        },
      ],
      userData,
      setError
    );
    if (!passed) {
      setManipulating(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("address_english", userData.address_english);
    formData.append("address_pashto", userData.address_pashto);
    formData.append("address_farsi", userData.address_farsi);
    formData.append("contact", userData.contact);
    formData.append("email", userData.email);
    formData.append("staff_type_id", StaffEnum.manager.toString());
    if (userData.picture) formData.append("picture", userData.picture);

    try {
      const url = userData.editable ? "office/update" : "office/store";
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        const staff = response.data.staff;
        setUserData({
          id: staff.id,
          picture: staff.picture,
          address_english: staff.name_english,
          address_farsi: staff.name_farsi,
          address_pashto: staff.name_pashto,
          contact: staff.contact,
          email: staff.email,
          optional_lang: "",
          editable: true,
        });
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
      setManipulating(false);
    }
  };

  return (
    <Card className="w-full self-center bg-card">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
          {t("office")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("general_desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0 flex flex-col gap-y-8">
        {loading ? (
          <NastranSpinner />
        ) : (
          <StaffInputs
            inputName={"address"}
            setUserData={setUserData}
            userData={userData}
            error={error}
            manipulating={manipulating}
            saveData={saveData}
          />
        )}
      </CardContent>
    </Card>
  );
}
