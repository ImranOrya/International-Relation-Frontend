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
import { useUserAuthState } from "@/context/AuthContextProvider";
import { useGlobalState } from "@/context/GlobalStateContext";
import { User, UserPermission } from "@/database/tables";
import { CACHE, PermissionEnum } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import Pagination from "@/components/custom-ui/table/Pagination";
import { setDateToURL, toLocaleDate } from "@/lib/utils";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ListFilter, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import AddUser from "./add/add-user";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import { Order, UserPaginationData, UserSearch, UserSort } from "@/lib/types";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";

export function UserTable() {
  const { user } = useUserAuthState();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();
  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const searchValue = searchParams.get("sch_val");
  const searchColumn = searchParams.get("sch_col");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const startDate = searchParams.get("st_dt");
  const endDate = searchParams.get("en_dt");
  const filters = {
    sort: sort == null ? "created_at" : (sort as UserSort),
    order: order == null ? "desc" : (order as Order),
    search: {
      column: searchColumn == null ? "username" : (searchColumn as UserSearch),
      value: searchValue == null ? "" : searchValue,
    },
    date:
      startDate && endDate
        ? [
            new DateObject(new Date(startDate)),
            new DateObject(new Date(endDate)),
          ]
        : startDate
        ? [new DateObject(new Date(startDate))]
        : endDate
        ? [new DateObject(new Date(endDate))]
        : [],
  };
  const loadList = async (
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
  ) => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Organize date
      let dates = {
        startDate: startDate,
        endDate: endDate,
      };
      // 2. Send data
      const response = await axiosClient.get(`users`, {
        params: {
          page: page,
          per_page: count,
          filters: {
            sort: filters.sort,
            order: filters.order,
            search: {
              column: filters.search.column,
              value: searchInput,
            },
            date: dates,
          },
        },
      });
      const fetch = response.data.users.data as User[];
      const lastPage = response.data.users.last_page;
      const totalItems = response.data.users.total;
      const perPage = response.data.users.per_page;
      const currentPage = response.data.users.current_page;
      setUsers({
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
        title: t("error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const initialize = async (
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
  ) => {
    if (!count) {
      const countSore = await getComponentCache(
        CACHE.USER_TABLE_PAGINATION_COUNT
      );
      count = countSore?.value ? countSore.value : 10;
    }
    if (!searchInput) {
      searchInput = filters.search.value;
    }
    if (!page) {
      page = 1;
    }
    loadList(searchInput, count, page);
  };
  useEffect(() => {
    initialize(undefined, undefined, 1);
  }, [sort, startDate, endDate, order]);
  const [users, setUsers] = useState<{
    filterList: UserPaginationData;
    unFilterList: UserPaginationData;
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

  const addItem = (user: User) => {
    setUsers((prevState) => ({
      filterList: {
        ...prevState.filterList,
        data: [user, ...prevState.filterList.data],
      },
      unFilterList: {
        ...prevState.unFilterList,
        data: [user, ...prevState.unFilterList.data],
      },
    }));
  };

  const deleteOnClick = async (user: User) => {
    try {
      const userId = user.id;
      const response = await axiosClient.delete("user/" + userId);
      if (response.status == 200) {
        const filtered = users.unFilterList.data.filter(
          (item: User) => userId != item?.id
        );
        const item = {
          data: filtered,
          lastPage: users.unFilterList.lastPage,
          totalItems: users.unFilterList.totalItems,
          perPage: users.unFilterList.perPage,
          currentPage: users.unFilterList.currentPage,
        };
        setUsers({ ...users, filterList: item, unFilterList: item });
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
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.users.name
  ) as UserPermission;
  const view = per?.view;
  const add = per?.sub.get(PermissionEnum.users.sub.add)?.add;

  const watchOnClick = async (user: User) => {
    const userId = user.id;
    navigate(`/users/${userId}`);
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {add && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("add")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <AddUser onComplete={addItem} />
          </NastranModel>
        )}

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
                if (searchRef.current != undefined)
                  await initialize(
                    searchRef.current.value,
                    undefined,
                    undefined
                  );
              }}
              className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
            >
              {t("search")}
            </SecondaryButton>
          }
        />
        <div className="sm:px-4 col-span-3 flex-1 self-start sm:self-baseline flex justify-end items-center">
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <SecondaryButton
                className="px-8 rtl:text-md-rtl ltr:text-md-ltr"
                type="button"
              >
                {t("filter")}
                <ListFilter className="text-secondary mx-2 size-[15px]" />
              </SecondaryButton>
            }
            showDialog={async () => true}
          >
            <FilterDialog
              filters={filters}
              sortOnComplete={async (filterName: UserSort) => {
                if (filterName != filters.sort) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filterName);
                  queryParams.set("order", filters.order);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/users?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              searchFilterChanged={async (filterName: UserSearch) => {
                if (filterName != filters.search.column) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filters.order);
                  queryParams.set("sch_col", filterName);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/users?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              orderOnComplete={async (filterName: Order) => {
                if (filterName != filters.order) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sort", filters.sort);
                  queryParams.set("order", filterName);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, filters.date);
                  navigate(`/users?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              dateOnComplete={(selectedDates: DateObject[]) => {
                if (selectedDates.length == 2) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("order", filters.order);
                  queryParams.set("sort", filters.sort);
                  queryParams.set("sch_col", filters.search.column);
                  queryParams.set("sch_val", filters.search.value);
                  setDateToURL(queryParams, selectedDates);
                  navigate(`/users?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              filtersShowData={{
                sort: [
                  {
                    name: "created_at",
                    translate: t("date"),
                    onClick: () => {},
                  },
                  {
                    name: "username",
                    translate: t("username"),
                    onClick: () => {},
                  },
                  {
                    name: "destination",
                    translate: t("department"),
                    onClick: () => {},
                  },
                  { name: "status", translate: t("status"), onClick: () => {} },
                  { name: "job", translate: t("job"), onClick: () => {} },
                ],
                order: [
                  {
                    name: "asc",
                    translate: t("asc"),
                    onClick: () => {},
                  },
                  {
                    name: "desc",
                    translate: t("desc"),
                    onClick: () => {},
                  },
                ],
                search: [
                  {
                    name: "username",
                    translate: t("username"),
                    onClick: () => {},
                  },
                  { name: "email", translate: t("email"), onClick: () => {} },
                  {
                    name: "contact",
                    translate: t("contact"),
                    onClick: () => {},
                  },
                ],
              }}
              showColumns={{
                sort: true,
                order: true,
                search: true,
                date: true,
              }}
            />
          </NastranModel>
        </div>
        <CustomSelect
          paginationKey={CACHE.USER_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(CACHE.USER_TABLE_PAGINATION_COUNT)
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) =>
            await initialize(undefined, parseInt(value), undefined)
          }
        />
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-center px-1 w-[60px]">
              {t("profile")}
            </TableHead>
            <TableHead className="text-start">{t("username")}</TableHead>
            <TableHead className="text-start">{t("role")}</TableHead>
            <TableHead className="text-start">{t("email")}</TableHead>
            <TableHead className="text-start">{t("contact")}</TableHead>
            <TableHead className="text-start">{t("join_date")}</TableHead>
            <TableHead className="text-start w-[60px]">{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>
              {skeleton}
              {skeleton}
              {skeleton}
            </>
          ) : (
            users.filterList.data.map((item: User) => (
              <TableRowIcon
                read={view}
                remove={false}
                edit={false}
                onEdit={async () => {}}
                key={item.email}
                item={item}
                onRemove={deleteOnClick}
                onRead={watchOnClick}
              >
                <TableCell className="px-1 py-0">
                  <CachedImage
                    src={item?.profile}
                    alt="Avatar"
                    ShimmerIconClassName="size-[18px]"
                    shimmerClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                    className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                  />
                </TableCell>
                <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                  {item.username}
                </TableCell>
                <TableCell>
                  <h1 className="truncate">{item?.destination}</h1>
                  <h1 className="truncate text-primary/90">{item?.job}</h1>
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="truncate rtl:text-sm-rtl rtl:text-end"
                >
                  {item.email}
                </TableCell>
                <TableCell dir="ltr" className="rtl:text-end rtl:text-sm-rtl">
                  {item?.contact == "null" ? "" : item?.contact}
                </TableCell>
                <TableCell>
                  {toLocaleDate(new Date(item.created_at), state)}
                </TableCell>
                <TableCell>
                  {item?.status ? (
                    <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-green-500 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                      {t("active")}
                    </h1>
                  ) : (
                    <h1 className="truncate text-center rtl:text-md-rtl ltr:text-lg-ltr bg-red-400 px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
                      {t("lock")}
                    </h1>
                  )}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${users.unFilterList.currentPage} ${t("of")} ${
          users.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={users.unFilterList.lastPage}
          onPageChange={async (page) =>
            await initialize(undefined, undefined, page)
          }
        />
      </div>
    </>
  );
}
