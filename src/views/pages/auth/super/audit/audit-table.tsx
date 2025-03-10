import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Audit } from "@/database/tables";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import Pagination from "@/components/custom-ui/table/Pagination";
import { toLocaleDate } from "@/lib/utils";
import { Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import {
  AuditFilter,
  AuditFilterBy,
  AuditPaginationData,
  AuditSearch,
  AuditSort,
  Order,
} from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import { CACHE } from "@/lib/constants";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";

export function AuditTable() {
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();

  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const filterBy = searchParams.get("filterBy");
  const [filters, setFilters] = useState<AuditFilter>({
    sort: sort ? (sort as AuditSort) : "id",
    order: order ? (order as Order) : "asc",
    filterBy: {
      column: filterBy ? (filterBy as AuditFilterBy) : "none",
      value: "",
    },
    search: {
      column: search ? (search as AuditSearch) : "user",
      value: "",
    },
    date: [],
  });
  const loadList = async (
    count: number,
    dataFilters: AuditFilter,
    page = 1
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates: {
        startDate: string | null;
        endDate: string | null;
      };
      if (filters.date.length === 1) {
        // set start date
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: null,
        };
      } else if (filters.date.length === 2) {
        // set dates
        dates = {
          startDate: filters.date[0].toDate().toISOString(),
          endDate: filters.date[1].toDate().toISOString(),
        };
      } else {
        // Set null
        dates = {
          startDate: null,
          endDate: null,
        };
      }
      // 2. Send data
      const response = await axiosClient.get(`audits/${page}`, {
        params: {
          per_page: count,
          filters: {
            sort: dataFilters.sort,
            order: dataFilters.order,
            search: {
              column: dataFilters.search.column,
              value: dataFilters.search.value,
            },
            date: dates,
          },
        },
      });
      const fetch = response.data.audits.data as Audit[];
      const lastPage = response.data.audits.last_page;
      const totalItems = response.data.audits.total;
      const perPage = response.data.audits.per_page;
      const currentPage = response.data.audits.current_page;
      setAudits({
        filterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
        unFilterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const initialize = async (dataFilters: AuditFilter) => {
    const count = await getComponentCache(CACHE.AUDIT_TABLE_PAGINATION_COUNT);
    loadList(count ? count.value : 10, dataFilters);
  };
  useEffect(() => {
    initialize(filters);
  }, [filters.order, filters.sort]);
  const [audits, setAudits] = useState<{
    filterList: AuditPaginationData;
    unFilterList: AuditPaginationData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
    unFilterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [state] = useGlobalState();

  const skeleton = (
    <TableRow>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );
  const view = true;
  const deleteOnClick = (item: any) => {
    return item;
  };
  const watchOnClick = (item: any) => {
    return item;
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        <CustomInput
          size_="lg"
          placeholder={`${t(filters.search.column)}...`}
          parentClassName="sm:flex-1 col-span-3"
          type="text"
          ref={searchRef}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
          endContent={
            <SecondaryButton
              onClick={async () => {
                if (searchRef.current != undefined) {
                  const newfilter = {
                    ...filters,
                    search: {
                      column: filters.search.column,
                      value: searchRef.current.value,
                    },
                  };

                  await initialize(newfilter);
                  setFilters(newfilter);
                }
              }}
              className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
            >
              {t("search")}
            </SecondaryButton>
          }
        />
        <CustomSelect
          paginationKey={CACHE.AUDIT_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(CACHE.AUDIT_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("No options found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) => {
            loadList(parseInt(value), filters);
          }}
        />
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("username")}</TableHead>
            <TableHead className="text-start">{t("colum")}</TableHead>
            <TableHead className="text-start">{t("role")}</TableHead>
            <TableHead className="text-start">{t("action")}</TableHead>
            <TableHead className="text-start">{t("table")}</TableHead>
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {/* {loading ? (
            <>
              {skeleton}
              {skeleton}
              {skeleton}
            </>
          ) : ( */}
          <>
            <TableRowIcon
              read={view}
              remove={false}
              edit={false}
              onEdit={async () => {}}
              key={""}
              item={""}
              onRemove={deleteOnClick}
              onRead={watchOnClick}
            >
              <TableCell>Ahmad</TableCell>
              <TableCell>permission</TableCell>
              <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                Admin
              </TableCell>
              <TableCell>
                <h1 className="truncate">delete</h1>
              </TableCell>
              <TableCell
                dir="ltr"
                className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
              >
                permission
              </TableCell>

              <TableCell>2025/3/2</TableCell>
            </TableRowIcon>
          </>
          <TableRowIcon
            read={view}
            remove={false}
            edit={false}
            onEdit={async () => {}}
            key={""}
            item={""}
            onRemove={deleteOnClick}
            onRead={watchOnClick}
          >
            <TableCell>Naweed</TableCell>
            <TableCell>name</TableCell>
            <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
              SuperAdmin
            </TableCell>
            <TableCell>
              <h1 className="truncate">Edite</h1>
            </TableCell>
            <TableCell
              dir="ltr"
              className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
            >
              user
            </TableCell>

            <TableCell>2025/2/24</TableCell>
          </TableRowIcon>
          <TableRowIcon
            read={view}
            remove={false}
            edit={false}
            onEdit={async () => {}}
            key={""}
            item={""}
            onRemove={deleteOnClick}
            onRead={watchOnClick}
          >
            <TableCell>Imran</TableCell>
            <TableCell>edit</TableCell>
            <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
              Debuger
            </TableCell>
            <TableCell>
              <h1 className="truncate">Creat</h1>
            </TableCell>
            <TableCell
              dir="ltr"
              className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
            >
              ngo
            </TableCell>

            <TableCell>2025/4/23</TableCell>
          </TableRowIcon>
          <TableRowIcon
            read={view}
            remove={false}
            edit={false}
            onEdit={async () => {}}
            key={""}
            item={""}
            onRemove={deleteOnClick}
            onRead={watchOnClick}
          >
            <TableCell>Jalal</TableCell>
            <TableCell>view</TableCell>
            <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
              Guest
            </TableCell>
            <TableCell>
              <h1 className="truncate">update</h1>
            </TableCell>
            <TableCell
              dir="ltr"
              className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
            >
              Donor
            </TableCell>

            <TableCell>2025/23/2</TableCell>
          </TableRowIcon>{" "}
          <TableRowIcon
            read={view}
            remove={false}
            edit={false}
            onEdit={async () => {}}
            key={""}
            item={""}
            onRemove={deleteOnClick}
            onRead={watchOnClick}
          >
            <TableCell>Ahmad</TableCell>
            <TableCell>update</TableCell>
            <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
              Admin
            </TableCell>
            <TableCell>
              <h1 className="truncate">delete</h1>
            </TableCell>
            <TableCell
              dir="ltr"
              className="rtl:text-md-rtl truncate rtl:text-end px-0 py-0"
            >
              permission
            </TableCell>

            <TableCell>2025/3/2</TableCell>
          </TableRowIcon>
          {/* // )} */}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${audits.unFilterList.currentPage} ${t("of")} ${
          audits.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={audits.unFilterList.lastPage}
          onPageChange={async (page) => {
            try {
              const count = await getComponentCache(
                CACHE.AUDIT_TABLE_PAGINATION_COUNT
              );
              const response = await axiosClient.get(`audits/${page}`, {
                params: {
                  per_page: count ? count.value : 10,
                },
              });
              const fetch = response.data.audits.data as Audit[];

              const item = {
                currentPage: page,
                data: fetch,
                lastPage: audits.unFilterList.lastPage,
                totalItems: audits.unFilterList.totalItems,
                perPage: audits.unFilterList.perPage,
              };
              setAudits({
                filterList: item,
                unFilterList: item,
              });
            } catch (error: any) {
              toast({
                toastType: "ERROR",
                title: t("Error"),
                description: error.response.data.message,
              });
            }
          }}
        />
      </div>
    </>
  );
}
