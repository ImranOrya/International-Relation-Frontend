import { useTranslation } from "react-i18next";
import LanguageTab from "./tabs/language/language-tab";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import PhoneInput from "@/components/custom-ui/input/phone-input";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumb className="mx-2 mt-2">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("settings")}</BreadcrumbItem>
      </Breadcrumb>
      <LanguageTab />
      <PhoneInput />
    </>
  );
}
