import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNgoAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { validateFile } from "@/lib/utils";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import { StatusEnum } from "@/lib/constants";

interface NgoProfileHeaderProps {
  agreement_status_id?: number;
  agreement_status?: string;
}
export default function NgoProfileHeader(props: NgoProfileHeaderProps) {
  const { agreement_status_id, agreement_status } = props;
  const { user, setNgo } = useNgoAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("ples_sel_vali_file"),
      });
      return;
    }
    const file = fileInput.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const result = validateFile(file, Math.round(maxFileSize), validTypes, t);
    if (!result) return;
    if (loading) return;
    setLoading(true);
    // Update profile
    const formData = new FormData();
    formData.append("profile", file);
    try {
      const response = await axiosClient.post("ngos/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          _method: "PUT", // Laravel treats this POST as a PUT
        },
      });
      if (response.status == 200) {
        // Change logged in user data
        await setNgo({
          ...user,
          profile: response.data.profile,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  const deleteProfilePicture = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete("delete/profile-picture");
      if (response.status == 200) {
        // Change logged in user data
        await setNgo({
          ...user,
          profile: undefined,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="self-center text-center">
      <CachedImage
        src={user?.profile}
        alt="Avatar"
        shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
        routeIdentifier={"profile"}
      />
      {loading && (
        <NastranSpinner
          label={t("in_progress")}
          className="size-[14px] mt-2"
          labelclassname="text-primary/80 rtl:text-sm-rtl ltr:text-sm-ltr"
        />
      )}
      <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
        <IconButton className="hover:bg-primary/20 transition-all text-primary">
          <label
            className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
          >
            <Pencil className={`size-[13px] pointer-events-none`} />
            <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>{t("choose")}</h1>
            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              className={`block w-0 h-0`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onFileUploadChange(e);
              }}
            />
          </label>
        </IconButton>

        <IconButton
          className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
          onClick={deleteProfilePicture}
        >
          <Trash2 className="size-[13px] pointer-events-none" />
          <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("delete")}</h1>
        </IconButton>
      </div>
      <BooleanStatusButton
        getColor={function (): {
          style: string;
          value?: string;
        } {
          return StatusEnum.registered === agreement_status_id
            ? {
                style: "border-green-500/90",
                value: agreement_status,
              }
            : StatusEnum.blocked == agreement_status_id
            ? {
                style: "border-red-500",
                value: agreement_status,
              }
            : StatusEnum.registration_incomplete == agreement_status_id
            ? {
                style: "border-blue-500/90",
                value: agreement_status,
              }
            : {
                style: "border-orange-500",
                value: agreement_status,
              };
        }}
      />
      <h1 className="text-primary font-semibold rtl:text-2xl-rtl ltr:text-4xl-ltr">
        {user?.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr">
        {user?.email?.value}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {user?.contact?.value}
      </h1>
    </div>
  );
}
