import Card from "@/components/custom-ui/card/Card";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { t } from "i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { IStaff, IStaffSingle } from "@/lib/types";
import { setServerError, validate } from "@/validation/validation";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { StaffEnum } from "@/lib/constants";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { Pencil, Trash2 } from "lucide-react";
import IconButton from "@/components/custom-ui/button/IconButton";
import { isFile } from "@/validation/utils";

import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { UserPermission } from "@/database/tables";
import { SectionEnum } from "@/lib/constants";
import { useUserAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";
type SliderProps = {
  id: string;
  picture: string;
  isactive: boolean;
};
type PictureProps = {
  id: string;
  picture: File | undefined | string;
  imageUrl: string;
  isactive: boolean;
};
export default function SliderSection() {
  const { user } = useUserAuthState();
  const { t } = useTranslation();
  const [technical, setTechnical] = useState<SliderProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [manipulating, setManipulating] = useState(false);
  const [pictureData, setPictureData] = useState<PictureProps>({
    id: "",
    picture: undefined,
    imageUrl: "",
    isactive: true,
  });

  const initialize = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/sliders");
      if (response.status == 200) {
        // 1. Add data to list
        const slider = response.data.sliders;
        setTechnical(slider as SliderProps[]);
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
    // 2. Store
    const formData = new FormData();
    formData.append("id", pictureData.id);
    if (pictureData.picture) formData.append("picture", pictureData.picture);

    try {
      const url = "slider/store";
      const response = await axiosClient.post(url, formData);
      if (response.status == 200) {
        const slider = response.data.sliders;
        setTechnical((prev) => [...slider, ...prev]);

        setPictureData({
          id: "",
          picture: undefined,
          imageUrl: "",
          isactive: false,
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
    }
  };

  const deleteOnClick = async (slider: SliderProps) => {
    try {
      const response = await axiosClient.delete(`/sliders/${slider.id}`);
      if (response.status == 200) {
        const filtered = technical.filter(
          (item: SliderProps) => slider.id != item.id
        );
        setTechnical(filtered);
      }
      toast({
        toastType: "SUCCESS",
        title: t("success"),
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    }
  };

  const per: UserPermission | undefined = user?.permissions.get(
    SectionEnum.about
  );

  const add = per ? per?.add : false;

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!fileInput.files) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("No file was chosen"),
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

    const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
    setPictureData({
      ...pictureData,
      picture: file,
      imageUrl: imageUrl,
    });
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  return (
    <>
      {" "}
      <Card className="w-full self-center bg-card ">
        <CardHeader className="relative text-start">
          <CardTitle className="rtl:text-4xl-rtl ltr:text-4xl-ltr text-tertiary text-start">
            {t("slider")}
          </CardTitle>
          <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
            {t("general_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-8 boder-4 border-primary items-center">
          {loading ? (
            <NastranSpinner />
          ) : (
            <div className=" w-full max-w-[1350px] sm:max-w-[400px] md:max-w-[14000px] bg-primary/5 border-2 border-primary/2 rounded-lg   items-center">
              <div className="flex flex-col justify-center gap-y-2 ">
                {isFile(pictureData.picture) ? (
                  <>
                    <img
                      src={pictureData.imageUrl}
                      className="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-sm"
                    />

                    <PrimaryButton className="mt-10 " onClick={saveData}>
                      {t("add")}
                    </PrimaryButton>
                  </>
                ) : (
                  <>
                    <CachedImage
                      src={pictureData.picture}
                      alt="Avatar"
                      shimmerClassName="size-[120px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-sm"
                      className="size-[120px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                    />
                    <IconButton className="hover:bg-primary/20 transition-all text-primary mx-auto">
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
                    <PrimaryButton className="ml-4 mb-4" onClick={saveData}>
                      {t("add")}
                    </PrimaryButton>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
        {technical.map((item: SliderProps) => (
          <Card className="group cursor-pointer relative ">
            <CardContent>
              <CachedImage
                key={item.id}
                src={item.picture}
                alt="Avatar"
                shimmerClassName="min-w-full h-full object-fill rounded-t"
                className="w-full h-48 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {" "}
                <Trash2
                  onClick={async () => await deleteOnClick(item)}
                  className="text-red-400 size-[18px] transition cursor-pointer hover:text-red-400/70 mt-4"
                />
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
