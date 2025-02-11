import {
  Audit,
  Country,
  District,
  Gender,
  News,
  NidType,
  Province,
  SelectUserPermission,
  User,
} from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export interface IMenuItem {
  name: string;
  key: string;
}
export interface UserInformation {
  profile: any;
  imagePreviewUrl: any;
  full_name: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  grant: boolean;
  job: {
    id: string;
    name: string;
    selected: boolean;
  };
  role: {
    id: string;
    name: string;
    selected: boolean;
  };
  contact: string;
  destination: {
    id: string;
    name: string;
    selected: boolean;
  };
  permission: Map<string, SelectUserPermission>;
  allSelected: boolean;
  created_at: string;
}

export interface UserPassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
export interface UserPaginationData {
  data: User[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Filter
export interface UserData {
  name: string;
  data: any;
}
export type Order = "desc" | "asc";
export type UserSort =
  | "created_at"
  | "username"
  | "destination"
  | "status"
  | "job";
export type UserSearch = "username" | "contact" | "email";
export interface UserFilter {
  sort: UserSort;
  order: Order;
  search: {
    column: UserSearch;
    value: string;
  };
  date: DateObject[];
}

export interface UserRecordCount {
  activeUserCount: number | null;
  inActiveUserCount: number | null;
  todayCount: number | null;
  userCount: number | null;
}
//
export interface AuditData {
  name: string;
  data: any;
}

export type AuditSort = "id" | "date" | "user" | "user_id" | "action" | "table";
export type AuditSearch = "user" | "user_id" | "table";
export type AuditFilterBy = "none" | "user" | "table" | "user_id";

export interface AuditFilter {
  sort: AuditSort;
  order: Order;
  filterBy: {
    column: AuditFilterBy;
    value: string;
  };
  search: {
    column: AuditSearch;
    value: string;
  };
  date: DateObject[];
}
export interface AuditPaginationData {
  data: Audit[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Multiselector
export interface Option {
  name: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

// Application
export type NgoSort = "id" | "name" | "type" | "contact" | "status";
export type NgoSearch =
  | "id"
  | "abbr"
  | "registration_no"
  | "name"
  | "type"
  | "contact";
export interface NgoFilter {
  sort: NgoSort;
  order: Order;
  search: {
    column: NgoSearch;
    value: string;
  };
  date: DateObject[];
}
export interface NgoPaginationData {
  data: NgoInformation[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NewsSort =
  | "id"
  | "type"
  | "priority"
  | "visible"
  | "visibility_date"
  | "date";
export type NewsSearch = "title";
export interface NewsFilter {
  sort: NewsSort;
  order: Order;
  search: {
    column: NewsSearch;
    value: string;
  };
  date: DateObject[];
}
export interface NewsPaginationData {
  data: News[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NgoInformation = {
  id: string;
  profile: string | undefined;
  name: string;
  abbr: string;
  status_id: number;
  status: string;
  registration_no: string;
  type_id: string;
  type: string;
  email: string;
  contact: string;
  username: string;
  registration_expired: boolean;
  created_at: string;
};

export type IStaff = {
  picture: string;
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
};
export interface IStaffSingle {
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
  picture: File | undefined | string;
  optional_lang: string;
  imageUrl: string;
  editable: boolean;
}

//add by Imran orya for Ngo list
//start
export type PublicNgo = {
  id: string;
  registration_no: string;
  name: string;
  type: string;
  status: string;
  abbr: string;
  establishment_date: string;
  director: string;
  province: string;
};
export interface NgoListFilter {
  sort: NgoSort;
  order: Order;
  search: {
    column: NgoSearch;
    value: string;
  };
}
export interface NgoListPaginationData {
  data: PublicNgo[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export interface FileType {
  id: string;
  path: string;
  name: string;
  extension: string;
  size: string;
}
export interface IDirector {
  id: string;
  is_active: string;
  name: string;
  surname: string;
  contact: string;
  email: string;
}
export interface INgoDirector {
  name_english: string;
  name_pashto: string;
  name_farsi: string;
  surname_english: string;
  surname_pashto: string;
  surname_farsi: string;
  contact: string;
  email: string;
  gender: Gender | undefined;
  moe_registration_no: string;
  nationality: Country | undefined;
  nid: string;
  identity_type: NidType | undefined;
  province: Province | undefined;
  district: District | undefined;
  establishment_date: DateObject | undefined;
  is_active: boolean;
  optional_lang: string;
}
//end
