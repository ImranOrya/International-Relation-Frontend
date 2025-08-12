import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { ScheduleDTO } from "@/database/tables";
import { useDatasource } from "@/hooks/use-datasource";
import axiosClient from "@/lib/axois-client";
import { generateUUID, isSameDatePure, isStartDateSmaller } from "@/lib/utils";
import { CalendarMinus, CalendarPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useNavigate } from "react-router";

export default function Schedules() {
  const [date, setDate] = useState<DateObject[]>([
    new DateObject(new Date()),
    new DateObject(new Date().setMonth(new Date().getMonth() + 1)),
  ]);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const transformSchedules = (data: ScheduleDTO[]) => {
    // List to store day names and dates
    const startDate = date[0];
    const endDate = date[1];
    let current = new DateObject(startDate);

    const daysBetween: {
      id: string;
      day: string;
      date: string;
      weekday: string;
      data: ScheduleDTO | null;
    }[] = [];

    while (current.toDate().getTime() <= endDate.toDate().getTime()) {
      let matchedData: ScheduleDTO | null = null;

      for (const item of data) {
        const compareDate = new DateObject(new Date(item.date));
        if (isSameDatePure(current.toDate(), compareDate.toDate())) {
          matchedData = item; // You can also store `item.data` if available
          break;
        }
      }
      daysBetween.push({
        id: generateUUID(),
        day: current.format("DD"),
        date: current.format("YYYY/MM/DD"),
        weekday: current.weekDay.name,
        data: matchedData,
      });

      current = current.add(1, "day");
    }

    return daysBetween;
  };
  const loadList = async () => {
    // 2. Send data
    const response = await axiosClient.get(`schedules`, {
      params: {
        start_date: date[0].toDate().toISOString(),
        end_date: date[1].toDate().toISOString(),
      },
    });
    return transformSchedules(response.data);
  };
  const { schedules, setSchedules, isLoading, refetch } = useDatasource<
    {
      id: string;
      date: string;
      day: string;
      weekday: string;
      data: ScheduleDTO | null;
    }[],
    "schedules"
  >(
    {
      queryFn: loadList,
      queryKey: "schedules",
    },
    [date],
    []
  );
  const handleDate = (selectedDates: DateObject[]) => {
    if (selectedDates.length == 2) setDate(selectedDates);
  };

  const loaderComponent = useMemo(
    () => (
      <>
        <NastranSpinner />
      </>
    ),
    []
  );
  return (
    <div className="space-y-1 px-2 pt-2 pb-12">
      <CustomMultiDatePicker
        className="w-fit bg-card py-2"
        value={date}
        dateOnComplete={handleDate}
      />
      {isLoading ? (
        loaderComponent
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {schedules.map((item) => {
            const inputDate = new Date(item.date); // Parse the ISO string
            const currentDate = new Date(); // Get current date/time
            const notAlllowed = isStartDateSmaller(inputDate, currentDate);
            return (
              <div
                key={item.id}
                className={`bg-card border-primary/20 pb-2 rounded space-y-2 hover:scale-110 transition-transform transform-gpu border antialiased p-1 ${
                  notAlllowed ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="rounded bg-primary/10 flex justify-between px-1 border-b">
                  <h1>{item.day}</h1>
                  <h1>{item.weekday}</h1>
                </div>

                {item?.data ? (
                  <div
                    className="text-center cursor-pointer space-y-1 mx-auto w-fit"
                    onClick={() => navigate(`/schedules/${item.data?.id}`)}
                  >
                    <CalendarMinus className="size-[18px] mx-auto" />
                    <div className="font-bold text-tertiary">
                      {item.data.status}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (!notAlllowed) navigate(`/schedules/${item.date}`);
                    }}
                    className={`text-center space-y-1 mx-auto w-fit`}
                  >
                    <CalendarPlus className="size-[18px] text-tertiary mx-auto" />
                    <h1>{t("not_scheduled")}</h1>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
