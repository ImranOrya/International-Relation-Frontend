import CachedImage from "@/components/custom-ui/image/CachedImage";
import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { UserPermission } from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { INgoInformation } from "./user-ngo-edit-page";

export interface UserEditHeaderProps {
  id: string | undefined;
  userData: INgoInformation | undefined;
  failed: boolean;
  setUserData: Dispatch<SetStateAction<INgoInformation | undefined>>;
}

export default function UserNgoEditHeader(props: UserEditHeaderProps) {
  const { id, userData, setUserData, failed } = props;
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.ngo
  );
  const hasEdit = per ? per?.edit : false;
  const hasRemove = per ? per?.delete : false;

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Handle execution
    if (loading) return;
    //
    setLoading(true);

    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!fileInput.files) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("no_file_was_chosen"),
      });
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("files_list_is_empty"),
      });
      return;
    }

    const file = fileInput.files[0];
    if (file.size >= maxFileSize) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("img_size_shou_less_2MB"),
      });
      return;
    }
    /** Type validation */
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("ples_sel_vali_img_file"),
      });
      return;
    }

    // Update profile
    const formData = new FormData();
    if (id !== undefined) formData.append("id", id);
    formData.append("profile", file);
    try {
      const response = await axiosClient.post("ngo/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          ngoInformation: {
            ...userData.ngoInformation,
            profile: response.data.profile,
          },
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
    if (userData?.ngoInformation?.profile == "") {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("no_img_selected"),
        duration: 3000,
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete("ngo/delete-profile/" + id);
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          ngoInformation: {
            ...userData.ngoInformation,
            profile: undefined,
          },
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
        src={userData?.ngoInformation?.profile}
        alt="Avatar"
        shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
      />
      {loading && (
        <NastranSpinner
          label={t("in_progress")}
          className="size-[14px] mt-2"
          labelclassname="text-primary/80 rtl:text-sm-rtl ltr:text-sm-ltr"
        />
      )}
      {userData && !failed && (
        <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
          {hasEdit && (
            <IconButton className="hover:bg-primary/20 transition-all text-primary">
              <label
                className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
              >
                <Pencil className={`size-[13px] pointer-events-none`} />
                <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>
                  {t("choose")}
                </h1>
                <input
                  type="file"
                  className={`block w-0 h-0`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onFileUploadChange(e);
                  }}
                />
              </label>
            </IconButton>
          )}
          {hasRemove && (
            <IconButton
              className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
              onClick={deleteProfilePicture}
            >
              <Trash2 className="size-[13px] pointer-events-none" />
              <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("delete")}</h1>
            </IconButton>
          )}
        </div>
      )}

      <h1 className="text-primary uppercase font-semibold rtl:text-2xl-rtl ltr:text-4xl-ltr max-w-64 truncate">
        {userData?.ngoInformation?.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr max-w-64 truncate">
        {userData?.ngoInformation?.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {userData?.ngoInformation?.contact}
      </h1>
    </div>
  );
}
