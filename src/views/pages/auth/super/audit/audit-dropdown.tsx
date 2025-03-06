import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { AuditTable } from "./audit-table";

export default function AuditDropdown() {
  const { t } = useTranslation();
  const stepperContext = useContext(StepperContext);
  const [userData, setUserData] = useState(stepperContext.userData || {});
  const [error, setError] = useState(stepperContext.error || new Map());
  const [selectedDates, setSelectedDates] = useState<DateObject[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", { userData, selectedDates });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-4">
          <APICombobox
            placeholderText={t("search_usertype")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["usertype"]: selection })
            }
            required={true}
            selectedItem={userData["usertype"]?.name}
            placeHolder={t("select_usertype")}
            errorMessage={error.get("usertype")}
            apiUrl={"usertype"}
            mode="single"
          />
          <APICombobox
            placeholderText={t("search_users")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["users"]: selection })
            }
            required={true}
            selectedItem={userData["users"]?.name}
            placeHolder={t("select_users")}
            errorMessage={error.get("users")}
            apiUrl={"users"}
            mode="single"
          />
          <APICombobox
            placeholderText={t("search_event")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["event"]: selection })
            }
            required={true}
            selectedItem={userData["event"]?.name}
            placeHolder={t("select_event")}
            errorMessage={error.get("event")}
            apiUrl={"event"}
            mode="single"
          />
          <APICombobox
            placeholderText={t("search_table")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["table"]: selection })
            }
            required={true}
            selectedItem={userData["table"]?.name}
            placeHolder={t("select_table")}
            errorMessage={error.get("table")}
            apiUrl={"table"}
            mode="single"
          />
          <CustomMultiDatePicker
            dateOnComplete={(dates: DateObject[]) => setSelectedDates(dates)}
            value={selectedDates}
            className="mt-7"
          />{" "}
          <Button type="submit" className="mt-6">
            {t("apply")}
          </Button>
        </div>
      </form>
      <AuditTable />
    </>
  );
}
