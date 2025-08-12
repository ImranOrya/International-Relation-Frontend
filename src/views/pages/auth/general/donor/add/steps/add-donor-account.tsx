import { Eye, EyeOff, Mail, Phone, RotateCcwSquare } from "lucide-react";
import { useContext, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/custom-ui/input/PasswordInput";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { generatePassword } from "@/validation/utils";

export default function AddDonorAccount() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col mt-10 w-full lg:w-[60%] gap-y-6 pb-12">
      <CustomInput
        size_="sm"
        dir="ltr"
        required={true}
        requiredHint={`* ${t("required")}`}
        className="rtl:text-end"
        lable={t("contact")}
        placeholder={t("enter_ur_pho_num")}
        defaultValue={userData["contact"]}
        type="text"
        name="contact"
        errorMessage={error.get("contact")}
        onChange={handleChange}
        startContent={
          <Phone className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        required={true}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        lable={t("username")}
        name="username"
        defaultValue={userData["username"]}
        placeholder={t("username")}
        type="text"
        parentClassName="w-full"
        errorMessage={error.get("username")}
        onBlur={handleChange}
      />
      <CustomInput
        size_="sm"
        name="email"
        required={true}
        requiredHint={`* ${t("required")}`}
        lable={t("email")}
        defaultValue={userData["email"]}
        placeholder={t("enter_your_email")}
        type="email"
        errorMessage={error.get("email")}
        onChange={handleChange}
        dir="ltr"
        className="rtl:text-right"
        startContent={
          <Mail className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <PasswordInput
        size_="sm"
        name="password"
        lable={t("password")}
        required={true}
        requiredHint={`* ${t("required")}`}
        defaultValue={userData["password"] || ""}
        onChange={handleChange}
        placeholder={t("enter_password")}
        errorMessage={error.get("password")}
        startContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <Eye className="size-[20px] text-primary-icon pointer-events-none" />
            ) : (
              <EyeOff className="size-[20px] pointer-events-none" />
            )}
          </button>
        }
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => {
              const generatedPassword = generatePassword();
              setUserData((prev: any) => ({
                ...prev,
                password: generatedPassword,
              }));
            }}
          >
            <RotateCcwSquare className="size-[20px] pointer-events-none" />
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
    </div>
  );
}
